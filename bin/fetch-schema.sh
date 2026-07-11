#!/bin/bash
# Fetch and pin the GitLab GraphQL introspection schema.
#
# Downloads the static introspection result (deprecated fields excluded) served
# by gitlab.com, then records the fetch date and content hash in
# provider-dev/config/schema_pin.json. The download is written to a temp file
# and only moved into place after it parses as JSON and contains a __schema
# key - validate-and-fail-without-writing.
#
# Usage: bin/fetch-schema.sh [--url URL]

set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="$( cd "$DIR/.." && pwd )"

SCHEMA_URL="https://gitlab.com/-/graphql/introspection_result_no_deprecated.json"

while [[ $# -gt 0 ]]; do
  case $1 in
    --url)
      SCHEMA_URL="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: fetch-schema.sh [--url URL]"
      exit 1
      ;;
  esac
done

DOWNLOAD_DIR="$BASE_DIR/provider-dev/downloaded"
CONFIG_DIR="$BASE_DIR/provider-dev/config"
TARGET_FILE="$DOWNLOAD_DIR/introspection_result_no_deprecated.json"
PIN_FILE="$CONFIG_DIR/schema_pin.json"

mkdir -p "$DOWNLOAD_DIR" "$CONFIG_DIR"

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

echo "Fetching $SCHEMA_URL"
curl -fsSL -o "$TMP_FILE" "$SCHEMA_URL"

# Validate before writing anything into the repo
node -e "
const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
const schema = doc.data ? doc.data.__schema : doc.__schema;
if (!schema || !Array.isArray(schema.types)) {
  console.error('Downloaded file is not a GraphQL introspection result');
  process.exit(1);
}
console.log('Introspection result OK: ' + schema.types.length + ' types, queryType = ' + schema.queryType.name);
" "$TMP_FILE"

HASH="$(node -e "
const crypto = require('crypto');
const fs = require('fs');
console.log(crypto.createHash('sha256').update(fs.readFileSync(process.argv[1])).digest('hex'));
" "$TMP_FILE")"

BYTES="$(wc -c < "$TMP_FILE" | tr -d ' ')"
FETCHED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mv "$TMP_FILE" "$TARGET_FILE"
trap - EXIT

cat > "$PIN_FILE" <<EOF
{
  "url": "$SCHEMA_URL",
  "file": "provider-dev/downloaded/introspection_result_no_deprecated.json",
  "fetchedAt": "$FETCHED_AT",
  "sha256": "$HASH",
  "bytes": $BYTES
}
EOF

echo "Pinned schema:"
cat "$PIN_FILE"

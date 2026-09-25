#!/bin/bash
# Fetch and pin the GitLab GraphQL introspection schema.
#
# Downloads the static introspection result (deprecated fields excluded)
# served by gitlab.com and compares its content hash with the pin in
# provider-dev/config/schema_pin.json. The schema is not versioned at the
# URL and gitlab.com deploys continuously, so the pin is the record of what
# was built:
#   - hash matches the pin: nothing is written (the pinned snapshot stands)
#   - hash differs, no --update: the script fails without writing anything
#     (schema drift must be a reviewed regeneration, never a silent one)
#   - hash differs, --update: the snapshot and the pin are rewritten; run
#     `make inventory generate` and review the generated diff
#   - no pin yet: the snapshot and the pin are written
# The download is validated (parses as JSON, carries __schema) before any
# comparison - validate-and-fail-without-writing.
#
# Usage: bin/fetch-schema.sh [--update] [--url URL]

set -euo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="$( cd "$DIR/.." && pwd )"

SCHEMA_URL="https://gitlab.com/-/graphql/introspection_result_no_deprecated.json"
UPDATE="false"

while [[ $# -gt 0 ]]; do
  case $1 in
    --update)
      UPDATE="true"
      shift
      ;;
    --url)
      SCHEMA_URL="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: fetch-schema.sh [--update] [--url URL]"
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

# Validate before comparing or writing anything into the repo
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

if [ -f "$PIN_FILE" ]; then
  PINNED_HASH="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).sha256 || '')" "$PIN_FILE")"
  if [ "$HASH" = "$PINNED_HASH" ]; then
    echo "Schema matches the pin ($HASH); nothing written."
    exit 0
  fi
  if [ "$UPDATE" != "true" ]; then
    echo "Schema drift: served sha256 $HASH differs from the pinned $PINNED_HASH."
    echo "Nothing written. Re-run with --update (make refresh-schema) to accept the upstream change, then regenerate and review the diff."
    exit 1
  fi
  echo "Accepting schema change via --update."
fi

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

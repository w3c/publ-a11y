#!/bin/bash

# Check for required commands
check_command() {
   if ! command -v "$1" &> /dev/null; then
       echo "Error: $1 is not installed. Please install it and try again."
       if [ "$1" = "yq" ]; then
           echo "To install yq, visit: https://github.com/mikefarah/yq#install"
       fi
       exit 1
   fi
}

check_command yq
check_command xsltproc
check_command java

# Setup
basedir=$(readlink -f "$0")
basedir=$(dirname "$basedir")
tmpdir=$(mktemp -d)
output_dir="$basedir/../2.0/draft/localizations"

# Input files
guidelines="$basedir/../2.0/draft/guidelines/index.html"
epub_techniques="$basedir/../2.0/draft/techniques/epub-metadata/index.html"
onix_techniques="$basedir/../2.0/draft/techniques/onix-metadata/index.html"

# XSLT files
xslt_extract_ids="$basedir/canonical-json-extract-ids.xsl"
xslt_extract_strings="$basedir/canonical-json-extract-strings.xsl"

# Extract unique IDs
xsltproc --stringparam guidelines "$guidelines" \
         --stringparam onix "$onix_techniques" \
         --stringparam epub "$epub_techniques" \
         "$xslt_extract_ids" "$guidelines" > "$tmpdir/ids.xml"

# Extract strings using IDs
xsltproc --stringparam guidelines "$guidelines" \
         --stringparam onix "$onix_techniques" \
         --stringparam epub "$epub_techniques" \
         --stringparam ids-file "$tmpdir/ids.xml" \
         "$xslt_extract_strings" "$tmpdir/ids.xml" > "$tmpdir/strings.xml"

# Convert to JSON
yq --prettyPrint --xml-skip-proc-inst --indent 4 -p=xml -o=json '.root' "$tmpdir/strings.xml" > "$output_dir/en-US/display_guide_vocabulary_w3c_en-US.json"

# Cleanup
rm -rf "$tmpdir"

echo "Transformation completed. JSON created at en-US/display_guide_vocabulary_w3c_en-US.json"
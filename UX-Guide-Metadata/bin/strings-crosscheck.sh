#!/bin/bash

# Script for crosschecking the strings in techniques and canonical JSON for localization
# Requires xsltproc, java, gnumeric (http://www.gnumeric.org/) and jq (https://jqlang.github.io/jq/download/)

# function to check whether a command is available
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is not installed. Please install it and try again."
        exit 1
    fi
}

# check for the presence of the necessary tools
check_command xsltproc
check_command java
check_command jq
check_command ssconvert

# pre-run
basedir=$(readlink -f "$0")
basedir=$(dirname "$basedir")
tmpdir=$(mktemp -d)

# input files
principles="$basedir/../draft/principles/index.html"
xslt_principles="$basedir/extract-ids-from-principles.xsl"
epub_techniques="$basedir/../draft/techniques/epub-metadata/index.html"
onix_techniques="$basedir/../draft/techniques/onix-metadata/index.html"
xslt_techniques="$basedir/extract-ids-from-techniques.xsl"
#canonical_json="$basedir/../draft/localizations/en-US/display_guide_vocabulary_w3c_en-US.json"
output_dir="$basedir/../draft/localizations"

# performs XSLT transformation on XHTML files
xsltproc "$xslt_principles" "$principles" > "$output_dir/principles-strings.xml"
xsltproc "$xslt_techniques" "$epub_techniques" > "$output_dir/epub-metadata-strings.xml"
xsltproc "$xslt_techniques" "$onix_techniques" > "$output_dir/onix-metadata-strings.xml"

# converts XML files to CSV
java -jar "$basedir/libs/xml2csv-1.1.jar" "$output_dir/principles-strings.xml" > "$output_dir/principles-strings.csv"
java -jar "$basedir/libs/xml2csv-1.1.jar" "$output_dir/epub-metadata-strings.xml" > "$output_dir/epub-metadata-strings.csv"
java -jar "$basedir/libs/xml2csv-1.1.jar" "$output_dir/onix-metadata-strings.xml" > "$output_dir/onix-metadata-strings.csv"

# converts JSON file to CSV
# json_in_csv=$(jq -r '
#   to_entries[] | 
#   select(.value | type == "object" and (has("descriptive") or has("compact"))) | 
#   [.key, .value.descriptive // "", .value.compact // ""] | 
#   @csv
# ' "$canonical_json")
# echo '"key","descriptive","compact"'  > "$output_dir/canonical-json-strings.csv"
# echo "$json_in_csv" >> "$output_dir/canonical-json-strings.csv"

# converts CSV files to Excel
ssconvert "$output_dir/principles-strings.csv" "$output_dir/principles-strings.xlsx"
ssconvert "$output_dir/epub-metadata-strings.csv" "$output_dir/epub-metadata-strings.xlsx"
ssconvert "$output_dir/onix-metadata-strings.csv" "$output_dir/onix-metadata-strings.xlsx"
# ssconvert "$output_dir/canonical-json-strings.csv" "$output_dir/canonical-json-strings.xlsx"

# cleanup
rm -f "$output_dir/principles-strings.csv"
rm -f "$output_dir/epub-metadata-strings.csv"
rm -f "$output_dir/onix-metadata-strings.csv"
# rm -f "$output_dir/canonical-json-strings.csv"

echo "Operations completed. Need to manually update Excel file localizations/crosscheck strings epub-onix-canonical_json.xlsx"
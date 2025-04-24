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
guidelines="$basedir/../2.1/draft/guidelines/index.html"
xslt_guidelines="$basedir/extract-ids-from-guidelines.xsl"
epub_techniques="$basedir/../2.1/draft/techniques/epub-metadata/index.html"
onix_techniques="$basedir/../2.1/draft/techniques/onix-metadata/index.html"
xslt_techniques="$basedir/extract-ids-from-techniques.xsl"
#canonical_json="$basedir/../draft/localizations/en-US/display_guide_vocabulary_w3c_en-US.json"
output_dir="$basedir/../2.1/draft/localizations"

# performs XSLT transformation on XHTML files
xsltproc "$xslt_guidelines" "$guidelines" > "$tmpdir/guidelines-strings.xml"
xsltproc "$xslt_techniques" "$epub_techniques" > "$tmpdir/epub-metadata-strings.xml"
xsltproc "$xslt_techniques" "$onix_techniques" > "$tmpdir/onix-metadata-strings.xml"

# converts XML files to CSV
java -jar "$basedir/libs/xml2csv-1.1.jar" "$tmpdir/guidelines-strings.xml" > "$tmpdir/guidelines-strings.csv"
java -jar "$basedir/libs/xml2csv-1.1.jar" "$tmpdir/epub-metadata-strings.xml" > "$tmpdir/epub-metadata-strings.csv"
java -jar "$basedir/libs/xml2csv-1.1.jar" "$tmpdir/onix-metadata-strings.xml" > "$tmpdir/onix-metadata-strings.csv"

# converts CSV files to Excel
ssconvert "$tmpdir/guidelines-strings.csv" "$output_dir/guidelines-strings.xlsx"
ssconvert "$tmpdir/epub-metadata-strings.csv" "$output_dir/epub-metadata-strings.xlsx"
ssconvert "$tmpdir/onix-metadata-strings.csv" "$output_dir/onix-metadata-strings.xlsx"

echo "Operations completed. Need to manually update Excel file localizations/crosscheck strings epub-onix-canonical_json.xlsx"
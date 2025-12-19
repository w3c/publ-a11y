#!/bin/bash

# Script for creating static version for the principles document
# It starts from the published draft (in the main branch): https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/principles/
# It generates the static version
# It runs nuchecker and link checker
# The output is a zip folder that can be sent to W3C staff for publishing on the website

# input
read -p 'Publishing date (format YYYY-MM-DD): ' publishDate

# pre-run: cleans and temporary directory...
BASEDIR=$(dirname "$0")
rm -rf $BASEDIR/_tmp
mkdir $BASEDIR/_tmp

# copies the content to the temporary directory
printf "\nCopying the content to the temporary directory..."
cp -a $BASEDIR/../draft/principles/. $BASEDIR/_tmp/
rm $BASEDIR/_tmp/*.md

# generates the static version
printf "\nGenerating static version..."
curl \
    -G \
    --data-urlencode "type=respec" \
    --data-urlencode "url=https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/principles/?specStatus=CG-FINAL&publishDate=$publishDate" \
    https://www.w3.org/publications/spec-generator/ \
    -o $BASEDIR/_tmp/index.html

# generates the static version
printf "\nReplacing URLs..."
sed 's#\.\./#https://www.w3.org/publishing/a11y/UX-Guide-metadata/#g' $BASEDIR/_tmp/index.html > $BASEDIR/_tmp/index-mod.html
mv $BASEDIR/_tmp/index-mod.html $BASEDIR/_tmp/index.html
#sed 's#\./#https://www.w3.org/publishing/a11y/UX-Guide-metadata/principles/#g' $BASEDIR/_tmp/index-mod.html > $BASEDIR/_tmp/index.html
#rm -f $BASEDIR/_tmp/index-mod.html

# runs nuchecker
nuVersion=$(java -jar libs/vnu/vnu.jar --version)
printf "\nRunning Nu Html Checker version $nuVersion..."
java -jar libs/vnu/vnu.jar \
	$BASEDIR/_tmp/index.html

if [ $? -gt 0 ] 
then 
	exit 1
fi

# runs link checker
# installed via commands:
# 	cpan install App::cpanminus
# 	cpanm W3C::LinkChecker@4.81
# 	cpan install Mozilla::CA
# tried to install version 5.0.0 on mac, but I got errors
checklinkVersion=$(checklink --version)
printf "\nRunning $checklinkVersion..."
checklink \
	--summary \
	--broken \
	"https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/principles/?specStatus=CG-FINAL&publishDate=$publishDate"

if [ $? -gt 0 ] 
then 
	exit 1
fi

# generates the zip
printf "\nZipping..."
cd $BASEDIR/_tmp
zip -r $BASEDIR/../UX-Guide-Metadata-principles.zip . -x ".DS_Store" -x "__MACOSX" -x "**/.DS_Store"

printf "\nZip ready in /UX-Guide-Metadata-principles.zip"

# cleaning
rm -rf $BASEDIR/_tmp
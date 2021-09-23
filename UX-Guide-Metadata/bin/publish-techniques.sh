#!/bin/bash

# Script for creating static version for the techniques documents
# It starts from the published draft (in the main branch):
# 	- https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/techniques/epub-metadata/
# 	- https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/techniques/onix-metadata/
# It generates the static version
# It runs nuchecker and link checker
# The output saved in the "live" directory UX-Guide-Metadata/techniques

# input
read -p 'Publishing date (format YYYY-MM-DD): ' publishDate
techniques=( "epub" "onix" )

# pre-run: cleans and temporary directory...
BASEDIR=$(dirname "$0")
rm -rf $BASEDIR/../techniques
mkdir $BASEDIR/../techniques

# copies the content to the temporary directory
printf "\nCopying the content to the temporary directory..."
cp -a $BASEDIR/../draft/techniques/. $BASEDIR/../techniques/

## Array Loop
for technique in "${techniques[@]}"
do 
	printf "\n\nWorking on technique $technique..."

	# generates the static version
	printf "\nGenerating static version..."
	curl \
		-G \
		--data-urlencode "type=respec" \
		--data-urlencode "url=https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/techniques/$technique-metadata/?specStatus=CG-FINAL&publishDate=$publishDate" \
		https://labs.w3.org/spec-generator/ \
		-o $BASEDIR/../techniques/$technique-metadata/index.html

	# generates the static version
	# generates the static version
	printf "\nReplacing URLs..."
	sed 's#\.\./\.\./#https://www.w3.org/publishing/a11y/UX-Guide-metadata/#g' $BASEDIR/../techniques/$technique-metadata/index.html > $BASEDIR/../techniques/$technique-metadata/index-mod.html
	sed 's#\.\./#https://www.w3.org/publishing/a11y/UX-Guide-metadata/techniques/#g' $BASEDIR/../techniques/$technique-metadata/index-mod.html > $BASEDIR/../techniques/$technique-metadata/index.html
	sed 's#\./#https://www.w3.org/publishing/a11y/UX-Guide-metadata/techniques/$technique-metadata/#g' $BASEDIR/../techniques/$technique-metadata/index.html > $BASEDIR/../techniques/$technique-metadata/index-mod.html
	mv $BASEDIR/../techniques/$technique-metadata/index-mod.html $BASEDIR/../techniques/$technique-metadata/index.html

	# runs nuchecker
	nuVersion=$(java -jar libs/vnu/vnu.jar --version)
	printf "\nRunning Nu Html Checker version $nuVersion..."
	java -jar libs/vnu/vnu.jar \
		$BASEDIR/../techniques/$technique-metadata/index.html

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
		"https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/techniques/$technique-metadata/?specStatus=CG-FINAL&publishDate=$publishDate"

	if [ $? -gt 0 ] 
	then 
		exit 1
	fi
  
done
exit
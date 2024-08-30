#!/bin/bash

# Script for creating static version for the UX-Guide-Metadata documents
# It starts from the published draft (in the main branch): https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/principles/
# It generates the static version
# It runs nuchecker and link checker
# The output is a zip folder that can be sent to W3C staff for publishing on the website

# pre-run: cleans and temporary directory...
basedir=$(readlink -f "$0")
basedir=$(dirname "$basedir")
documents=( "principles" "techniques/epub-metadata" "techniques/onix-metadata" )
bold=$(tput bold)
normal=$(tput sgr0)

# input
read -p 'Publishing date (format YYYY-MM-DD): ' publishDate

for document in "${documents[@]}"
do 
	echo "\n\nDocument ${bold}$document${normal}..."
	
	# tmp dir for document
	tmpdir=$(mktemp -d)

	# copies the content to the temporary directory
	printf "\nCopying the content to the temporary directory..."
	cp -a "$basedir/../draft/$document/." $tmpdir
	rm $tmpdir/*.md
	
	# generates the static version
	printf "\nGenerating static version...\n"
	curl \
		-G \
		--data-urlencode "type=respec" \
		--data-urlencode "url=https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/$document/?specStatus=CG-DRAFT&publishDate=$publishDate" \
		https://labs.w3.org/spec-generator/ \
		-o "$tmpdir/index.html"
	
	# runs nuchecker
	nuVersion=$(java -jar "$basedir/libs/vnu/vnu.jar" --version)
	printf "\nRunning Nu Html Checker version $nuVersion...\n"
	java -jar "$basedir/libs/vnu/vnu.jar" \
		"$tmpdir/index.html"
	
	
	# commenting while waiting for this issue to be fixed: https://github.com/validator/validator/issues/1745
	# if [ $? -gt 0 ] 
	# then 
	#	exit 1
	# fi
	
	# runs link checker
	# installed via commands:
	# 	cpan install App::cpanminus
	# 	cpanm W3C::LinkChecker@4.81
	# 	cpan install Mozilla::CA
	# tried to install version 5.0.0 on mac, but I got errors
	checklinkVersion=$(checklink --version)
	printf "\nRunning $checklinkVersion...\n"
	checklink \
		--summary \
		--broken \
		"https://w3c.github.io/publ-a11y/UX-Guide-Metadata/draft/$document/?specStatus=CG-DRAFT&publishDate=$publishDate"
	
	# commenting while waiting for this issue to be fixed: https://github.com/w3c/publ-a11y/issues/386
	# if [ $? -gt 0 ] 
	# then 
	#	exit 1
	# fi
	
	printf "\nMoving temporary files to directory..."
	mv $tmpdir/* "$basedir/../2.0/$document/"

done

printf "\nDone"
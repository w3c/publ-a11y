# Convert documents from Markdown to HTML.
exclusions=README.md
sources=$(filter-out $(exclusions), $(wildcard *.md))
all: $(sources:.md=.html)
%.html : %.md
	pandoc -s --html-q-tags $< -o $@

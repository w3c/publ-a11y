---
title: User Experience Guide for Displaying Accessibility metadata for EPUB
...

## Status of This Document
Editors Draft - Version 0.9 (05/24/2019)

This document was published by the DIAGRAM Center Standards Working Group and DAISY's Transition to EPUB Working group  as an Editor's Draft.

Comments regarding this document are welcome. Please [file an issue using our GitHub repository issue tracker](https://github.com/benetech/UX-Guide-EPUB-A11y-Metadata/issues).

---

## Table of Contents
- [Status of This Document](#status-of-this-document)
- [Table of Contents](#table-of-contents)
- [General Overview](#general-overview)
- [Discovering Accessible Content](#discovering-accessible-content)
	* [Exposing EPUB Accessibility Metadata to Search Engines](#exposing-epub-accessibility-metadata-to-search-engines)
- [UI Technical Details](#ui-technical-details)
- [Order of Key Information](#order-of-key-information)
	* [Screen Reader Friendly](#screen-reader-friendly)
	* [Audiobook](#audiobook)
	* [Accessibility Summary](#accessibility-summary)
	* [EPUB Accessibility Conformance](#epub-accessibility-conformance)
	* [Certified By](#certified-by)
	* [Certifier Credential](#certifier-credential)
	* [Certifier Report](#certifier-report)
	* [Hazards](#hazards)
	* [All Accessibility Metadata](#all-accessibility-metadata)
- [ONIX Metadata](#onix-metadata)
	* [ONIX feed examples](#onix-feed-examples)
	* [Inaccessible](#inaccessible)
	* [Screen Reader Friendly](#screen-reader-friendly-1)
	* [Audio Book](#audio-book)
	* [Accessibility Summary](#accessibility-summary-1)
	* [EPUB and WCAG Conformance Level Reached](#epub-and-wcag-conformance-level-reached)
	* [Certified By](#certified-by-1)
	* [Certifier Credential](#certifier-credential-1)
	* [Certifier Report](#certifier-report-1)
	* [Hazards](#hazards-1)
    * [All Accessibility Metadata](#all-accessibility-metadata-1)
- [Acknowledgements](#acknowledgements)

---

## General Overview
This document will help those who wish to provide accessibility metadata directly to users understand how to represent machine readable
accessibility metadata in a user friendly User Interface / User
Experience (UI/UX).

Metadata found either inside an EPUB or in its corresponding ONIX file
may have important accessibility information that will help end users
find and determine if this EPUB can meet their specific accessibility
needs.

Most metadata is meant to be machine readable so that it can be used to
aid in user search queries such as "Find all EPUB books that contain
large print, or braille, or that has met a certain level of
accessibility conformance." The exception to this is the accessibility
summary which, if present, describes in human-readable text all the
accessibility features and any shortcomings present in this book that
can be directly presented to the end user.

**NOTE: All images provided here may be protected under copyright and
are only used as a reference.**

Here is an example of what a user-friendly accessibility metadata web
page could look like:

> **Screen Reader Friendly:** Yes

> **Accessibility Summary:** This publication includes markup to enable
accessibility and compatibility with assistive technology. Images,
audio, and video in the publication are well-described in conformance
with WCAG 2.0 AA.

> **EPUB Accessibility Conformance:**
[WCAG-AA](http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa)

> **Certified By:** ACME Certification

> **Certifier Credential:**
> <img src="./media/image1.png" alt="ACME Inc. credential webpage" width="50"/>

> **All Accessibility Metadata:**

> <img src="./media/image5.png" alt="Toggle box with all accessibility information" width="300"/>

---

## Discovering Accessible Content

The guidelines for presentation of accessibility metadata in this
document are intended to improve the user experience when readers browse
the catalog entry for a book. However, accessibility metadata also has a
vital role to play in helping readers discover books that are accessible
for them. Book providers, vendors, and libraries are encouraged to
create searching and filtering tools that interpret accessibility
metadata to aid in discovery; a full discussion of this topic is out of
scope for this document, but these brief notes may be helpful until
further research and development leads to more specific guidance.

While every user has different accessibility needs, meeting the Web
Content Accessibility Guidelines (WCAG) 2.0 requirements, even at level
A, is a baseline that ensures a book will be widely accessible. Book
providers may therefore wish to create specific search capabilities to
permit users to find books that have declared conformance to WCAG at any
level. A search filter called "Accessible" that retrieves all books
with metadata of `<link rel="dcterms:conformsTo"
href="http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a" />`
or the equivalent for wcag-aa and ultimately for wcag-aaa would fill
this need.

Audiobooks created for mainstream use provide important access for many
users with disabilities even though they are not accessible to others.
Book providers may already have search tools aimed at finding
audiobooks, since they are popular and fairly common, but if not, this
would be a good addition to the suite of tools for finding accessible
books. Note that audiobooks may not pass WCAG requirements because they
are targeted at a specific audience rather than broadly accessible and
so would not be found using the "Accessible" search suggested above.

Any of the metadata fields discussed in detail below could also be used
as a filter; a "Screen-reader accessible" search would be valued by
screen reader users, and a way to ensure no books with hazards are
downloaded would be valued by those with light-sensitive epilepsy or
other hazard-related conditions. But if a single additional search
filter fits best in a site's UI, a tool for finding accessible materials
that declare conformance to WCAG 2.0 is the most likely choice.

---

## Exposing EPUB Accessibility Metadata to Search Engines

If an ebook catalogue is publicly available, metadata related to the
accessibility of the contents can be displayed to search engine
crawlers. This type of metadata for search engines is not available to
users, but can be easily interpreted by machines (browsers, spiders,
crawlers, etc.) so that accessibility information is correctly passed
from machine to machine; this operation improves the Search Engine
Optimization of the entire website as it allows the search engine to get
a clear idea of the contents presented (and their level of accessibility).

### Implementation

From a technical point of view, this type of metadata can be presented
in a machine-readable form using the Schema.org standard. Schema.org
codes can be inserted into the HTML code of the web page in which the
single title is presented.

There are three ways to implement Schema.org in your web pages:

-   Microdata

-   RDFa

-   JSON-LD

The first two ways involve inserting metadata directly into the HTML
code which could complicate the implementation, since programmers will
need to touch the templates of the web pages, which may make maintenance
complex.

JSON-LD instead requires that all metadata are grouped into a single
object (coded with JSON-LD standard) within a tag `<script
type="application/ld+json">` positioned anywhere in the web page
code, so much easier to implement and maintain; this is also the
[format recommended by
Google](https://developers.google.com/search/docs/guides/intro-structured-data).

Although it is not required by Schema.org, we suggest you avoid
inserting the accessibility metadata out of context. Instead, insert
accessibility metadata into the [scheme
Book](https://schema.org/Book) and accompany them with some
bibliographic and technical data about the text so as to contextualize
them. Most likely these data are already available in the website
database (because they are shown in the online catalog), so they will
not be extracted from the EPUB file, but retrieved directly from the
backend.

The minimum data that we recommend to add are:

-   `bookFormat` (EBook)

-   `ISBN`

-   `Name` (ebook title)

Metadata can also be enriched with all the features available at
[Schema.org/Book](https://schema.org/Book). The more
enriched the metadata presented to search engine crawlers is, the better
the discoverability of the content presented.

Not all of the accessibility metadata found in the EPUB has been adopted
by Schema.org only the following accessibility metadata properties have
been added so far: `accessibilityFeature`, `accessibilityHazard`,
`accessMode`, `accessModeSufficient`, `accessibilitySummary`,
`accessibilityControl`, and `accessibilityAPI`.

#### Example
```json
<script type="application/ld+json">
	{
		"@context": "http://schema.org",
		"@type": "Book",
		"bookFormat": "EBook",
		"isbn": "9780000000000",
		"name": "Moby Dick",
		"accessMode": [
			"Visual",
			"Textual"
		],
		"accessModeSufficient": [
			{
				"@type": "ItemList",
				"itemListElement": [
					"textual"
				]
			},
			{
				"@type": "ItemList",
				"itemListElement": [
					"textual",
					"visual"
				]
			},
			{
				"@type": "ItemList",
				"itemListElement": [
					"visual"
				]
			}
		],
		"accessibilityFeature": [
			"alternativeText",
			"longDescription",
			"printPageNumbers"
		],
		"accessibilityHazard": "none",
		"accessibilitySummary": "This publication includes markup to enable accessibility and compatibility with assistive technology. Images, audio, and video in the publication are well-described in conformance with WCAG 2.0 A. Structural navigation may be inconsistent."
	}
</script>
```

Once the metadata is implemented, it is important to check its validity and make sure that it is interpreted correctly by search engines; this
is possible with a free tool provided by Google: the [Structured Data
Testing
Tool](https://search.google.com/structured-data/testing-tool/u/0/).
Through the graphical interface you can enter the URL of a web page to
be analyzed or a snippet of code with the metadata you want to check.
After processing the data, the tool shows on the left side of the screen
the code of the web page (or snippet) and on the right side the data
interpreted by Google.

---

## UI Technical Details

When you have accessibility metadata about an EPUB it is important to
share this information with the user in a user friendly way. At a very
high level when displaying information about an EPUB you may just want
to acknowledge that there is "Accessibility Features" or
"Accessibility Information" available and if the user would like to
get at this information they can click a link or an image which will
then provide the information that is discussed below.

For Example:

> Title: Huckleberry Finn
> 
> Author: Mark Twain
> 
> Copyright: 1999
> 
> ISBN: 9780486110035
> 
> Publisher: Dover Publications
> 
> Book Features: <u>Accessibility Information</u> *(textual link to accessibility information below)*
 
Or
 
> Book Features:
> 
> <img src="./media/image3.png" alt="Accessibility Information" width="75"/>
> 
> *(clickable image to accessibility information below)*
> 
> *Suggested Alt-text for image "Accessibility Information"*

---

## Order of Key Information

1.  [Screen Reader Friendly](#screen-reader-friendly)

2.  [Audiobook](#audiobook) (if present)

3.  [Accessibility Summary](#accessibility-summary)

4.  [EPUB Accessibility Conformance](#epub-accessibility-conformance)

5.  [Certified By](#certified-by)

6.  [Certifier's Credential](#certifier-credential)

7.  [Certifier's Report](#certifier-report) (if present)

8.  [Hazards](#hazards)

9.  [All Accessibility Metadata](#all-accessibility-metadata)

This metadata as outlined in the [1.0 Accessibility Specification Conformance and Discoverability](http://www.idpf.org/epub/a11y/) can be found inside the EPUB's opf file usually found in `OEBPS/package.opf`

> **Note**: At the end of this document are the [ONIX equivalent
metadata](#onix-metadata) for each of these, if defined.
While the examples shown here are for EPUB 3.x, there are equivalents
for EPUB 2.x which can be found in the [Accessibility 1.0 specification](http://www.idpf.org/epub/a11y/).


### Screen Reader Friendly

**Value**: *Yes* / *No* / *Unknown*

This data is derived from the EPUB package metadata inside the OPF file:

```xml
<meta property="schema:accessModeSufficient">textual</meta>
```

If this metadata exists (ie. "**textual**" within
`accessModeSufficient` by itself) then report *"Screen Reader Friendly: Yes"*

**Important**: This is not the same as "**visual**, **textual**" or
"**textual, visual**" because the combination means that the book
requires both visual and textual abilities to access the data, not
textual alone. Only having `accessModeSufficient` be "***textual***"
as a separate entry ensures the document is screen reader friendly.

> **Note**: As long as there is an entry that reads `<meta
property="schema:accessModeSufficient">textual</meta>` the book
can claim *"Screen Reader Friendly: Yes"*.


There may also be other `accessModeSufficient` entries with combinations
of access modes such as "textual, visual" which indicate other ways to
read the book.

When `accessModeSufficient` exists but does not have "textual" by
itself, report *"Screen Reader Friendly: No"*.

When there is no `accessModeSufficient` metadata present, report
*"Screen Reader Friendly: unknown or not provided"*.

#### Example 1.1 (metadata present)

##### Metadata

```xml
<meta property="schema:accessModeSufficient">visual</meta>
```

##### UI

"Screen Reader Friendly: Yes"

(because ***textual*** was present by itself in `accessModeSufficient`)

#### Example 1.2 (multiple metadata `accessModeSufficient` fields present)

##### Metadata

```xml
<meta property="schema:accessModeSufficient">visual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessModeSufficient">textual, visual</meta>
```

##### UI

"Screen Reader Friendly: Yes"

(because ***textual*** was present by itself in `accessModeSufficient`)

#### Example 1.3 (metadata present but not Screen Reader Friendly)

##### Metadata

```xml
<meta property="schema:accessModeSufficient">visual</meta>
<meta property="schema:accessModeSufficient">textual, visual</meta>
```

##### UI

"Screen Reader Friendly: No"

(because ***textual*** was not present by itself in `accessModeSufficient`)

#### Example 1.4 (metadata missing)

##### Metadata

""

##### UI

"Screen Reader Friendly: Unknown"

(because `accessModeSufficient` is not found at all in the metadata)

<!-- QUI -->

### Audiobook

**Values**: *Yes / (if No - Omit this section)*

This data is derived from the EPUB package metadata inside the OPF file:

```xml
<meta property="schema:accessModeSufficient">auditory</meta>
```

If this metadata exists (ie. "**auditory**" within `accessModeSufficient` by itself) then report *"Audiobook: Yes".*

**Important**: This is not the same as "**textual**, **auditory**" or
"**auditory**, **textual**" as this indicates that the book requires
both textual and auditory abilities to access the data, not auditory
alone. Only having `accessModeSufficient` be "**auditory**" as a
separate entry ensures the document is an audiobook.

>**Note**: As long as you find ```<meta property="schema:accessModeSufficient">auditory</meta>``` the
book can claim "**Audiobook: Yes**".

There may also be other `accessModeSufficient` entries with combinations
of access modes such as "textual, visual" which indicate other ways to
read the book.

Note: If you can not report that this is an audiobook then do not
present any information to the user for this category, since 99% of EPUB
books are not audiobooks. Simply omit this section.

#### Example 2.1 (metadata present auditory)

##### Metadata

```xml
<meta property="schema:accessModeSufficient">auditory</meta>
<meta property="schema:accessModeSufficient">visual</meta>
```

##### UI

"Audiobook: Yes"

(because "**auditory**" was found alone in `accessModeSufficient`)

#### Example 2.2 (metadata present but not an Audiobook)

##### Metadata

```xml
<meta property="schema:accessModeSufficient">visual</meta>
<meta property="schema:accessModeSufficient">auditory, visual</meta>
```

##### UI

Omit this section

(Nothing presented to the user because "**auditory**" was not found
alone in `accessModeSufficient`)

#### Example 2.3 (metadata not present)

##### Metadata

""

##### UI

Omit this section

(Nothing presented to the user because `accessModeSufficient` is not
present at all in the metadata)

### Accessibility Summary

**Value**: Textual Data from metadata

This data is pulled directly from the EPUB package metadata inside the
OPF file:

```xml
<meta property="schema:accessibilitySummary">
```

>**Note**: We will be creating additional guidance for publishers on how to
best write these summaries.

>**Note**: If the metadata does not exist this should say "No Summary
Available"

>**Note**: This data could be in a language other than English but would be
tagged as such.

#### Example 3.1 (metadata present)

##### Metadata

```xml
<meta property="schema:accessibilitySummary">
	This publication includes markup to enable accessibility and compatibility with assistive technology. Images, audio, and video in the publication are well-described in conformance with WCAG 2.0 AA. Structural navigation may be inconsistent.
</meta>
```

##### UI

Accessibility Summary:

This publication includes markup to enable accessibility and
compatibility with assistive technology. Images, audio, and video in the
publication are well-described in conformance with WCAG 2.0 A.

#### Example 3.2 (metadata missing)

##### Metadata

""

##### UI

"Accessibility Summary: None provided"


### EPUB Accessibility Conformance

**Value**: Textual Link based on Metadata (WCAG-A, WCAG-AA, WCAG-AAA) or raw URL found in EPUB OPF file's metadata field

```xml
<link rel="dcterms:conformsTo">
```

>**Note**: Interpret this metadata to be as human friendly as possible. So if
the URI is:

>- "http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a"
report it as "[**WCAG-A**](http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a)"
which links to this URL.

>- "http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa"
report it as "[**WCAG-AA**](http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa)"
which links to this URL.

>- "http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aaa"
report it as "[**WCAG-AAA**](http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a)"
which links to this URL.

If the URL is anything other than the three listed above, then providing
the raw URL which is also a link is the only option, since this may be a
link to a different conformance standard (i.e. some audio conformance
specification for an audio book).

>**Note**: A case insensitive comparison should be done to replace the URI
with human-readable text for WCAG-AA, etc.

>**Note**: If you do not wish to have clickable links here, you may omit them
as long as you make the links available in the section [All
Accessibility Metadata](#all-accessibility-metadata), described below.

>**Note**: The above three URIs could change in the future since they point
to an IDPF page; this work has been moved to the W3C. If a change
occurs, other URIs will be recommended.

#### Example 4.1 (metadata present)

##### Metadata

```xml
<link rel="dcterms:conformsTo" href="http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa" />
```

##### UI

EPUB Accessibility Conformance:
[WCAG-AA](http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa)

(Because this links to one of the three URIs outlined above)

#### Example 4.2 (metadata pointing to another specification)

##### Metadata

```xml
<link rel="dcterms:conformsTo" href="http://www.daisy.org/guidelines/epub/navigable-audio-only-epub3-guidelines" />
```

##### UI

"EPUB Accessibility Conformance: Custom specification"

(Because this URI is different than what was outlined above. The book may qualify for conformance as an optimized publication.)

#### Example 4.3 (metadata missing)

##### Metadata

""

##### UI

"EPUB Accessibility Conformance: None provided"

### Certified By

**Value**: Textual Data from metadata

This data is pulled directly from the EPUB package metadata inside the
OPF file:

```xml
<meta property="a11y:certifiedBy">
```

>**Note**: If the metadata does not exist this should say "None provided"

#### Example 5.1 (metadata present 3rd party)

##### Metadata

```xml
<meta property="a11y:certifiedBy">3rd Party Company Name</meta>
```

##### UI

"Certified By: 3rd Party Company Name"

#### Example 5.2 (metadata present self Certified)

##### Metadata

```xml
<dc:publisher>Publisher Name</dc:publisher>
<meta property="a11y:certifiedBy">Publisher Name</meta>
```

##### UI

"Self Certified By: Publisher Name"

#### Example 5.3 (metadata missing)

##### Metadata

""

##### UI

"Certified By: None provided"

### Certifier Credential

**Value**: Potentially linked textual data from metadata

This data is pulled directly from the EPUB package metadata inside the
OPF file:
```xml
<meta property="a11y:certifierCredential">
```

>**Note**: This metadata could be a simple text string in which case you
would just display it, or it could be a URI to the certifier's
credential web page.

If the metadata value is a URI, you could have some standard
certification logo which would be clickable and link to the certifier's
credential webpage.

If you do not wish to have clickable links here, you may omit them as
long as you make the links available in the section [All Accessibility
Metadata](#all-accessibility-metadata), described below.

If you are aware of a list of organizations who offer third-party
certification, a short list of certifier's logos could be cached and
displayed when appropriate. For example:

#### Example 6.1 (Text)

##### Metadata

```xml
<meta property="a11y:certifierCredential">XYZ Certified
Accessible</meta>
```

##### UI

"Certifier Credential: XYZ Certified Accessible"

#### Example 6.2 (Generic 3rd party URL)

##### Metadata

```xml
<meta property="a11y:certifiedBy">ACME Inc.</meta>
<meta property="a11y:certifierCredential">https://3rd-party-certifier-credential.com</meta>
```

##### Metadata

Certifier Credential

> [<img src="./media/image1.png" alt="ACME Inc. credential webpage" width="50"/>](https://3rd-party-certifier-credential.com)

> *(Clickable Image to the URI of the certifiers credential's webpage from metadata)*
> 
> *alt-text "ACME Inc. credential webpage"*
> 
> *(Image here of a checkmark inside a shield is just for reference feel free to choose your own image)*

>**Note**: There may be an image that is associated with specific Certifier Credential image (ie. Mark/Stamp/Seal) which could be used here. If you would like to display this image, or any other, you would need to be coordinate this out of band with the certifier agency as it is not part of the metadata delivered with the book.

**Or**

Certifier's Credential: [ACME Inc. credential webpage](https://3rd-party-certifier-credential.com)

> *(Clickable link to the URI to the certifiers credentials from metadata)*

#### Example 6.3 (metadata missing)

##### Metadata

""

##### UI

"Certifier Credential: None provided"

### Certifier Report

**Value**: Potentially linked textual data from metadata

This data is pulled directly from the EPUB package metadata inside the
OPF file:

```xml
<link rel="a11y:certifierReport" href="http://www.example.com/a11y/report/9780000000001"/>
```

Ideally you would have a clickable link to the certification
accessibility report.

If you do not wish to have clickable links here, you may omit them as
long as you make the links available in the section [All Accessibility
Metadata](#all-accessibility-metadata), described below.

#### Example 7.1 (URL)

##### Metadata

```xml
<meta property="a11y:certifiedBy">ACME Inc.</meta>
<link rel="a11y:certifierReport" href="http://www.example.com/a11y/report/9780000000001"/>
```

##### UI

Certifier Report

[<img src="./media/image2.png" alt="ACME Inc. Report webpage" width="50"/>](http://www.example.com/a11y/report/9780000000001)

> *(Clickable Image to the URI of the report from metadata)*
>
> *alt-text "ACME Inc. Report webpage"*
>
> *(Image here of checkmark with clipboard is just for reference feel
> free to choose your own image)*

**Or**

Certifier Report: [ACME Inc. Accessibility Report](http://www.example.com/a11y/report/9780000000001)

> *(Clickable link to the URI of the report from metadata)*

#### Example 7.2 (metadata missing)

##### Metadata

""

##### UI

Omit this section

(Omit this section if the metadata is missing, as most of the time there
will be no report available.)

### Hazards

**Values**: flashing, motion simulation, sound, no flashing, no motion
simulation, no sound, none, or Unknown.

This data is found in the EPUB package metadata inside the OPF file:

```xml
<meta property="schema:accessibilityHazard">none</meta>
```

Hazards are the only metadata which can be expressed as either positive
or negative statements, so metadata authors can confirm either the
presence of the hazard, such as "*flashing*", or the absence of the
hazard, "*noFlashingHazard*" and similarly for "*sound* /
*noSoundHazard*" and "*motion* / *noMotionSimulationHazard*". There
is also the metadata value "*none*", which covers all three categories
and corresponds to "*noFlashingHazard*", "*noSoundHazard*" and
"*noMotionSimulationHazard*".

>**Note**: In the section "[All Accessibility
Metadata](#all-accessibility-metadata)" Hazards will be
displayed exactly how the publisher provided them so simplifying here
with using "none" can be an option instead of saying explicitly "no
Sound, no Flashing, no Motion Simulation"

#### Example 8.1 (metadata present flashing)

##### Metadata

```xml
<meta property="schema:accessibilityHazard">flashing</meta>
```

##### UI

"Hazard: Flashing"

(because "***flashing***" was found in `accessibilityHazard`)

#### Example 8.2 (metadata present motionSimulation)

##### Metadata

```xml
<meta property="schema:accessibilityHazard">motionSimulation</meta>
```

##### UI

"Hazard: Motion Simulation"

(because "***motionSimulation***" was found in `accessibilityHazard`)

#### Example 8.3 (metadata present sound)

##### Metadata

```xml
<meta property="schema:accessibilityHazard">sound</meta>
```

##### UI

"Hazard: Sound"

(because "***sound***" was found in `accessibilityHazard`)

#### Example 8.4 (multiple hazards present)

##### Metadata

```xml
<meta property="schema:accessibilityHazard">sound</meta>
<meta property="schema:accessibilityHazard">motionSimulation</meta>
<meta property="schema:accessibilityHazard">flashing</meta>
```

##### UI

"Hazard: Sound, Motion Simulation, and Flashing"

(because "***sound***", "***motionSimulation***" ,
"***flashing***" and were all found in `accessibilityHazard`)

#### Example 8.5 (metadata present none)

##### Metadata

```xml
<meta property="schema:accessibilityHazard">none</meta>
```

##### UI

Omit this section

**Or**

"Hazards: none provided"

Nothing presented to the user because there are no hazards; since 99.9%
of EPUBs won't have any hazards, there is no need to report "Hazards:
No" for every EPUB.

#### Example 8.6 (metadata present: `noFlashingHazard`, `noSoundHazard`, and `noSimulation`)

##### Metadata

```xml
<meta property="schema:accessibilityHazard">noFlashingHazard</meta>
<meta property="schema:accessibilityHazard">noSoundHazard</meta>
<meta property="schema:accessibilityHazard">noMotionSimulationHazard</meta>
```

##### UI

Omit this section

**Or**

"Hazards: none"

**Or**

"Hazards: No Flashing, No Sound, No Motion Simulation"

#### Example 8.7 (metadata not present)

##### Metadata

""

##### UI

"Hazards: None provided"

We want to make the distinction here between No Hazards and missing
hazard metadata therefore for the missing metadata case we need to
inform the user we don't know about any hazards which may or maynot be
present.

---

## <a name="all-accessibility-metadata)">All Accessibility Metadata</a>

**Value**: Link to complete list of all metadata fields

Here are [all the possible accessibility metadata properties](https://www.w3.org/wiki/WebSchemas/Accessibility).

This section can either be a separate page that is linked to or better
yet an HTML Summary/Details element that users can expand to get all the
accessibility metadata field elements. Here you would expose:
`accessibilityFeature`, `accessibilityHazard`, `accessMode`,
`accessModeSufficient`, as well as all the accessibility metadata and
conformance metadata listed above.

#### Example 9.1 (all metadata fields present)

##### Metadata

```xml
<meta property="schema:accessibilityFeature">alternativeText</meta>
<meta property="schema:accessibilityFeature">longDescription</meta>
<meta property="schema:accessibilityFeature">printPageNumbers</meta>
<meta property="schema:accessibilityHazards">noSoundHazard</meta>
<meta property="schema:accessibilityHazards">noMotionSimulationHazard</meta>
<meta property="schema:accessibilityHazards">noFlashingHazard</meta>
<meta property="schema:accessMode">visual</meta>
<meta property="schema:accessMode">textual</meta>
<meta property="schema:accessModeSufficient">visual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessModeSufficient">visual,textual</meta>
<meta property="a11y:certifiedBy">ACME Certification</meta>
<meta property="a11y:certifierCredential">https://ACME-Certification.org/</meta>
<link rel="dcterms:conformsTo" href="http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a/" />
<meta property="schema:accessibilitySummary">
	This publication includes mark-up to enable accessibility and compatibility with assistive technology. Images, audio, and video in the publication are well-described in conformance with WCAG 2.0 A.
</meta>
```

##### UI

**Accessibility Features**:

- alternativeText

- longDescriptions

- printPageNumbers

**Accessibility Hazards**:

- No Sound Hazard

- No Motion Simulation Hazard

- No Flashing Hazard

**AccessMode**:

- visual

- textual

**Access Mode Sufficient**:

- visual

- textual

- visual, textual

**Certified By**:

ACME Certification

**Certifier's Credential**:

[https://ACME-Certification.org/](https://acme-certification.org/)

**Conforms To**:

[http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a](http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a)

**Accessibility Summary**:

This publication includes markup to enable accessibility and compatibility with assistive technology. Images, audio, and video in the publication are well-described in conformance with WCAG 2.0 A.

#### Example 9.2 (all metadata fields missing)

##### Metadata

""

##### UI

**Accessibility Features**:

None provided

**Accessibility Hazards**:

None provided

**AccessMode**:

None provided

**Access Mode Sufficient**:

None provided

**Certified By**:

None provided

**Certifier's Credential**:

None provided

**Conforms To**:

None provided

**Accessibility Summary**:

None provided

---

## ONIX Metadata

> **Note**:  
> ONIX does not have an exact 1:1 mapping with EPUB accessibility metadata so unfortunately not all of the accessibility metadata found in an EPUB exists in ONIX at the time of this publication. There are plans
to add this metadata to future versions of ONIX but no time frame has been announced. This [EPUB to ONIX crosswalk](http://www.a11ymetadata.org/the-specification/metadata-crosswalk/) outlines the current overlap in metadata which will get updated as these two specifications evolve. It is important to note that there were a number of new accessibility metadata codes added to ONIX 3 to support the Accessibility 1.0 specification. Which means that ONIX 2 has a limited number of accessibility metadata codes and is something not
covered in this document.


### ONIX feed examples

#### ONIX feed describing an EPUB

Here is an example of an ONIX feed (version 3.0), which will be used as a reference point for the following examples on EPUB accessibility metadata: the results of the XPath shown are based on this example.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ONIXMessage xmlns="http://ns.editeur.org/onix/3.0/reference" release="3.0">
	<Header>...</Header>
	<Product>
		<RecordReference>123456789</RecordReference>
		<NotificationType>01</NotificationType>
		<ProductIdentifier>
			<ProductIDType>03</ProductIDType>
			<IDValue>9780000000000</IDValue>
		</ProductIdentifier>
		<ProductIdentifier>
			<ProductIDType>15</ProductIDType>
			<IDValue>9780000000000</IDValue>
		</ProductIdentifier>
		<DescriptiveDetail>
			<ProductComposition>00</ProductComposition>
			<ProductForm>ED</ProductForm>
			<ProductFormDetail>E101</ProductFormDetail>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>00</ProductFormFeatureValue>
				<ProductFormFeatureDescription>
					This publication includes mark-up to enable accessibility and compatibility with assistive technology. Images, audio, and video in the publication are well-described in conformance with WCAG 2.0 A.
				</ProductFormFeatureDescription>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>03</ProductFormFeatureValue>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>10</ProductFormFeatureValue>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>11</ProductFormFeatureValue>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>13</ProductFormFeatureValue>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>14</ProductFormFeatureValue>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>22</ProductFormFeatureValue>
			</ProductFormFeature>
			<ProductFormFeature>
				<ProductFormFeatureType>09</ProductFormFeatureType>
				<ProductFormFeatureValue>94</ProductFormFeatureValue>
				<ProductFormFeatureDescription>http://www.example.com/a11y/report/9780000000001</ProductFormFeatureDescription>
			</ProductFormFeature>
			<PrimaryContentType>10</PrimaryContentType>
			<EpubTechnicalProtection>03</EpubTechnicalProtection>
			<EpubUsageConstraint>
				<EpubUsageType>04</EpubUsageType>
				<EpubUsageStatus>02</EpubUsageStatus>
			</EpubUsageConstraint>
			<TitleDetail>...</TitleDetail>
			<Contributor>...</Contributor>
			<Extent>...</Extent>
			<Subject>...</Subject>
		</DescriptiveDetail>
		<CollateralDetail>...</CollateralDetail>
		<PublishingDetail>...</PublishingDetail>
		<RelatedMaterial>...</RelatedMaterial>
		<ProductSupply>...</ProductSupply>
	</Product>
</ONIXMessage>
```

#### ONIX feed describing an Audiobook Here is an example of an ONIX feed (version 3.0) for describing an audiobook.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ONIXMessage xmlns="http://ns.editeur.org/onix/3.0/reference" release="3.0">
	<Header>...</Header>
	<Product>
		<RecordReference>123456789</RecordReference>
		<NotificationType>01</NotificationType>
		<ProductIdentifier>
			<ProductIDType>03</ProductIDType>
			<IDValue>0000000000000</IDValue>
		</ProductIdentifier>
		<DescriptiveDetail>
			<ProductComposition>00</ProductComposition>
			<ProductForm>AO</ProductForm>
			<PrimaryContentType>01</PrimaryContentType>
			...
			<TitleDetail>...</TitleDetail>
			<Contributor>...</Contributor>
			<Extent>...</Extent>
			<Subject>...</Subject>
		</DescriptiveDetail>
		<CollateralDetail>...</CollateralDetail>
		<PublishingDetail>...</PublishingDetail>
		<RelatedMaterial>...</RelatedMaterial>
		<ProductSupply>...</ProductSupply>
	</Product>
</ONIXMessage>
```

### Inaccessible

The ONIX standard, unlike the Schema.org standard, provides a method to
indicate that a given title is inaccessible, which is described as
"Known to lack significant features required for broad accessibility."
This is indicated by using [List:
196](https://ns.editeur.org/onix/en/196); Code 09 within a
ProductFormFeatureValue element.

*Vendors may omit all other accessibility metadata fields.*

#### ONIX Example 10.1

##### Metadata

An excerpt of ONIX indicating an
inaccessible product is:

```xml
<ProductFormFeature>
	<ProductFormFeatureType>09</ProductFormFeatureType>
	<ProductFormFeatureValue>09</ProductFormFeatureValue>
</ProductFormFeature>
```

##### UI

"Inaccessible"

### Screen Reader Friendly

Not available in ONIX

### Audio Book

This information can be retrieved from ONIX [code list 81](https://ns.editeur.org/onix/en/81); Code: 01: Audiobook.

#### ONIX Example 11.1

##### XPath

This field is true if the XPath returns at least one element for:

```xml
//Product/DescriptiveDetail/PrimaryContentType[text()="01"] or
//Product/DescriptiveDetail/ProductContentType[text()="01"]
```

##### UI

"Audiobook: Yes"

### Accessibility Summary

This information can be retrieved from ONIX [code list:
196](https://ns.editeur.org/onix/en/196); Code: 00:
Accessibility Summary.

#### ONIX Example 12.1

##### XPath

The value can be retrieved using XPath:

```xml
//Product/DescriptiveDetail/ProductFormFeature[ProductFormFeatureType="09" and ProductFormFeatureValue="00"]/ProductFormFeatureDescription/text()
```

##### UI

Accessibility Summary:

This publication includes markup to enable accessibility and
compatibility with assistive technology. Images, audio, and video in the
publication are well-described in conformance with WCAG 2.0 A.

### EPUB and WCAG Conformance Level Reached

- For WCAG-A: [List: 196](https://ns.editeur.org/onix/en/196); Code: 02: Accessibility Specification 1.0 A
- For WCAG-AA: [List: 196](https://ns.editeur.org/onix/en/196); Code: 03: Accessibility Specification 1.0 AA
- For WCAG-AAA: Not available in ONIX.

#### ONIX Example 13.1

##### XPath

If the following XPath returns at least one result:

```xml
//Product/DescriptiveDetail/ProductFormFeature[ProductFormFeatureType="09"
and ProductFormFeatureValue="02"]
```

##### UI

"Accessibility Conformance: WCAG-A"

#### ONIX Example 13.2

##### XPath

If the following XPath returns at least one result:

```xml
//Product/DescriptiveDetail/ProductFormFeature[ProductFormFeatureType="09"
and ProductFormFeatureValue="03"] returns at least one result
```

##### UI

"Accessibility Conformance: WCAG-AA"

### Certified By

Not available in ONIX

### Certifier Credential

Not available in ONIX

### Certifier Report

[List: 196](https://ns.editeur.org/onix/en/196); Code: 94:
Compliance web page for detailed accessibility information

**Or**

If a publisher is self-certifying, Code: 96: Publisher's web page
for detailed accessibility information

#### ONIX Example 14.1

##### XPath

The value can be retrieve using XPath:

```xml
//Product/DescriptiveDetail/ProductFormFeature[ProductFormFeatureType="09" and ProductFormFeatureValue="94"]/ProductFormFeatureDescription/text()
```

```xml
//Product/DescriptiveDetail/ProductFormFeature[ProductFormFeatureType="09" and ProductFormFeatureValue="96"]/ProductFormFeatureDescription/text()
```

##### UI

Certifier Report

[<img src="./media/image2.png" alt="Report webpage" width="50"/>](http://www.example.com/a11y/report/9780000000001)

> *(Clickable Image to the URI of the report from metadata)*
>
> *alt-text "Report webpage"*
>
> *(Image here of checkmark with clipboard is just for reference feel
> free to choose your own image)*

**Or**

Certifier Report: *Accessibility Report*

> *(Clickable link to the URI of the report from metadata)*

### Hazards

Not available in ONIX

### <a name="all-accessibility-metadata-1)">All Accessibility Metadata</a>

For a complete list of [ONIX accessibility metadata refer to the crosswalk.](http://www.a11ymetadata.org/the-specification/metadata-crosswalk/)

---
## Acknowledgements

### Editors
* Charles LaPierre
* Gregorio Pellegrino

### Contributors
* Avneesh Singh
* Dave Cramer
* George Kerscher
* Jason White
* Madeleine Rothberg
* Rachel Comerford
* Rick Johnson

### Reviewers
* Erin Kirchner-Lucas



# Localization strategy for User Experience Guide for Displaying Accessibility Metadata 2.0
 
An ebook can be purchased in any country without limited availability or additional delivery costs. Readers want consistent display of accessibility information, and that’s the primary role of the display guide. We understand that different countries or different target audience services may want to use specific language, and we have provided flexibility in the guide to accommodate this while maintaining a high level of understanding and similar quality to help users in a country find likewise information between two bookstores or libraries in the same language area. 

With the rapidly evolving landscape of accessible ebooks available, most concerned persons are discovering a new world. To ensure the information is widely spread and understood, the implication of local actors like NGOs libraries serving persons with disabilities and other local actors in the fight to end the book famine for readers with print disabilities is crucial and should be highlighted.  

The localization of the display guide is a good opportunity to make known the rich accessibility features offered by modern formats like EPUB. Reversely, having a local project scale to write an understandable vocabulary to describe such features is a precious qualitative approach that will benefit to every player in the value chain. 

To build a local project and facilitate feedback comparisons, you can use open source methodology, resources, and prototypes published by EDRLab for the original [Signposting accessible digital books project](https://edition-accessible.github.io/signalement/en/index-en.html) that led to the initial feedback addressed in early 2022 ([Feedback letter to W3C](https://edition-accessible.github.io/signalement/documents/EDRLab-Signalement_lettreW3C_EN.pdf)). And has already been used and adapted in various places. 

In these projects, emphasis was placed on the implications for the end users. For instance, the French wording proposed by EDRLab resulted from a quantitative survey of different reader groups, carefully selected panels of individual observations, and an extended feedback process through a dedicated formular available on the 140 first implementation platforms.

Additionally, companies like Vitalsource that need wide localization have offered to open-source their professional translation work, which has produced the needed quantity and that is better to use than nothing when no national project has issued a handcrafted vocabulary.  

To reconcile both sources of provided localization materials, we propose a collection mechanism based on a detailed identification of the provenance. Because persons and organisations with different levels of technicality must be able to contribute, we accept both raw files via Pull requests and also propose a friendly localization user interface through GitLocalize. 

## How to contribute?
First let us know as soon as possible that you are working on a localization and wish to submit it. That allows us to prepare a placeholder for your work. This is not mandatory but we invite you to contact the group and participate to a regular call of the working group as those are open to anyone. 

When you are ready to publish your work, two options are possible: 
* If you don’t know what a JSON or a Pull Request is, you are welcome to contact us so we can attribute a translator role at the [Gitlocalize dedicated project page](https://gitlocalize.com/repo/9555).
* If you feel technically ready or have a collaborator that can push a pull request, the process is to duplicate the canonical original file UX-Guide-Metadata/draft/localizations/en-US/display_guide_vocabulary_w3c_en-US.json, modify it by changing the values in front of each key, and open a pull request so we can review it. Please be aware that we could have questions or ask for precision in the process before accepting and merging your contribution. 

## How to choose between localization files?
The first keys of each JSON files contains descriptive information about it, including 
* **Author**, name of the organisation responsible for the establishment and maintenance of this localisation
* **Language**, is a 4 letters code where the two first letters specifies the language as per ISO 639-1 and the two others the country as per ISO 3166-1 alpha-2 
* **Variant**, a one word free name to identify your work
* **Audience** describes the public. We recommend to use any vocabulary from the ONIX list 28. More than one audience can be informed with a comma separating each.
* **Description**, a free field including a short description of how this localization was obtained 
If a need arises, we’ll consider adding a dedicated HTML page to help visualize the different  

## Folder and file structure
Each identical language and country is in a dedicated folder. 

Each file has the same first part display_guide_vocabulary_ and a variant suffix composed of the responsible organisation sort name (per example: w3c_) and the 4 letters language code  (per example: en-US).  

## FAQ
This is a placeholder to provide answers to common questions that can be opened as localization new issue (neds a GitHub account) or sent directly to gautier.chomel@edrlab.org. 







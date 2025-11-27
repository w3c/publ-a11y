---
title: "Explainer: Extended Descriptions for Publications and the Web"
date: 11-27-2025
author: Publishing Maintenance Group Accessibility Task Force
---

# Explainer: Extended Descriptions for Publications and the Web

## Authors

- Publishing Maintenance Group Accessibility Task Force

## Participate

- Issue tracker: 
- Discussion: 

## Introduction

This explainer documents the need for and proposed semantics for extended descriptions: longer, structured content that explains images, diagrams, tables, formulas, and other information-rich material that cannot be adequately represented by brief alternative text alone but needs to be closely linked to the image it explains.

The document summarizes goals, non-goals, candidate approaches, examples, alternatives considered, and next steps to enable review by APA, TAG, implementers and the community.

## User-Facing Problem

Users encounter images and non-text content that convey complex information (e.g., technical diagrams, charts, mathematical notation, museum objects) where a short `alt` is insufficient and an extended, structured description is provided. Without clear affordances, users may not discover these descriptions or understand the linking between them and the primary content.

Authors and reading systems need a reliable, discoverable, and programmatic way to identify and surface extended descriptions in consistent ways without breaking reading flow or excluding non-AT users.

Collection managers and accessibility experts need to be able to identify and collect extended descriptions with links to their context image.

## Goals

- Provide machine-discoverable semantics for extended descriptions.
- Support linking between primary content and descriptions, including across documents.
- Ensure reading systems can surface descriptions in a way that preserves pagination and context.
- Make descriptions usable by all readers, not just AT users.

## Non-goals

- Mandate a single UI for presenting extended descriptions.
- Reintroduce problematic `longdesc` behaviors.

## User research

Publisher feedback from Brazil, Europe, and North America has informed this work, with proposed solutions reviewed and validated by some publishers. Publisher associations in Italy and France have been engaged. Community use cases and testing are documented in publishing and accessibility working groups (see References).

A proof-of-concept (POC) in both HTML and EPUB formats has been developed and refined over three years by the DAISY Transition to EPUB working group, demonstrating practical patterns and their effectiveness across reading systems.

Further user testing is recommended to validate discoverability and presentation patterns in paginated vs. continuous reading contexts.

## State of the art

### Recommended technique: identify link with `aria-details`

Today, best practice relies on the use of `aria-details` to identify the link to the extended description. The referenced element is typically an in-document anchor that links to a section in the same document or to a separate file; the latter option avoids heavy additions to the original content and gives users the choice to consult the extra content.

- Place the extended description in a separate HTML file (e.g., appendix or dedicated section).
- In the main content, after the image, add a link to the extended description. The link can be text or an icon (with accessible name).
- The image should have a brief `alt` and an `aria-details` attribute pointing to the link's ID.
- The link should have a unique ID.
- In the external file, each description is in a `section` with a matching ID, a heading, a presentational copy of the image, the detailed description, and a backlink (`role="doc-backlink"`) to the main content.
- Note: WAI-ARIA 1.2 specifies that content referenced by `aria-details` is not flattened into accessible name/description computation; it is intended to expose structured, potentially complex descriptions for discovery and navigation (see ARIA `aria-details` in References). Authors should ensure the referenced link is visible to all users and test the pattern across common reading systems and screen readers because user agent and AT support can vary.

### Current limitations

Tests revealed limitations related to identifying extended descriptions with certainty. It manifests in two critical areas:
- when a link points to an extended description, there is no standardized semantic marker to distinguish it from other types of links, preventing assistive technologies from announcing the link's purpose appropriately and limiting user agents' ability to provide specialized navigation or presentation features.
- extended description content itself lacks a specific semantic role to distinguish it from generic sections, making it difficult to automatically locate and process extended descriptions within a document or across a collection of documents.

Additionally, testing showed declarative workarounds being impractical when parsed using XPath, including identification limited to a single document, expensive preprocessing and DOM traversals, and a requirement for sophisticated parsing logic that makes implementations less scalable for many images or large collections — more error-prone and resource-intensive compared with simple, explicit markup approaches.

### The footnote precendent

## Proposed approach

We propose two complementary ARIA roles to strengthen link semantics and make extended-description relationships explicit to assistive technologies:

- `role="extendeddescriptionref"` to mark the forward link (the anchor in the primary content that points to the extended description).
- `role="extendeddescription"` to mark the container that holds the extended description (which can be in the same document or in an external resource).


Example pattern:

```html
<!-- Main content -->
<img id="img1" src="figure1.png" alt="Schematic of the device" aria-details="extdesc-1">
<a id="extdesc-1" role="extendeddescriptionref" href="extended-descriptions.xhtml#desc-img1">Extended description</a>

<!-- Extended description file -->
<section id="desc-img1" role="extendeddescription">
    <h2>Extended description — Figure 1</h2>
    <img src="figure1.png" role="presentation" alt="">
    <p>...detailed structured description...</p>
    <a role="doc-backlink" href="chapter01.xhtml#img1">Back to image</a>
```html
<!-- Main content -->
<img id="img1" src="figure1.png" alt="Schematic of the device" aria-details="extdesc-1">
<a id="extdesc-1" role="extendeddescriptionref" href="extended-descriptions.xhtml#desc-img1">Extended description</a>

<!-- Extended description file -->
<section id="desc-img1" role="extendeddescription">
	<h2>Extended description — Figure 1</h2>
	<img src="figure1.png" role="presentation" alt="">
	<p>...detailed structured description...</p>
	<a role="doc-backlink" href="chapter01.xhtml#img1">Back to image</a>
</section>
```

### Approach sustainability

Using explicit markup reduces the computational overhead associated with reverse-checking `aria-details` to identify links to extended descriptions.

The combination of `aria-details`, `role="extendeddescriptionref"` and `role="extendeddescription"` provides bidirectional programmatic relationships even when extended descriptions reside in separate HTML files.

`role="extendeddescription"` would identify extended description containers across document boundaries.

Similar semantic identification challenges have been successfully addressed, demonstrating the value of specific semantic roles for different types of linked supplementary content. For example, DPUB ARIA roles provide the `doc-footnote` and `doc-noteref` roles to identify notes and their references, enabling assistive technologies and text-to-speech engines to announce them appropriately and user agents to implement specialized navigation features.

### Dependencies on non-stable features

- Any ARIA role additions require coordination with the ARIA Working Group.

### Solving specific goals

- ARIA exposes semantics to assistive technologies.
- Reading systems can implement strong affordances and a consistent user experience (for example, panels or a navigate-and-return flow).
- Tools can extract together images and extended description.

## Alternatives considered

## Alternatives considered

- `<details>`: native HTML, but problematic in EPUB due to pagination and inconsistent support.
- `longdesc`: rejected due to historical misuse, lack of adoption, and removal from HTML and EPUB specifications.
- `rel="extendeddescription"`: could provide additional context but is not considered by assistive technologies.
- `epub:type`: lacks sufficient granularity to distinguish extended descriptions from other supplementary content types; would require new values and coordination with the EPUB Working Group and is not currently supported by assistive technologies.
- RDFa/microdata: structured data approaches that add semantic richness but require parsing infrastructure and do not directly expose relationships to assistive technologies via the accessibility tree.
- Reusing `doc-noteref`/`doc-footnote` semantics: while structurally similar, extended descriptions differ in scope and purpose from footnotes; repurposing existing roles would create confusion for users and implementers.

## Accessibility, Internationalization, Privacy, and Security Considerations

- Accessibility: use `aria-details`, unique IDs, and visible links or icons. Backlinks help users return to their reading position.
- Internationalization: localize link text and icon alt text; mark descriptions with appropriate `lang`.
- Privacy/Security: treat description files as any other resource; respect EPUB packaging and web security policies.

## Stakeholder feedback 

- Fondazione LIA and Benetech recommend the separate file technique for EPUB. 
- Reading system developers and AT vendors should be engaged to validate UX and API exposure.

## Next steps

1. Socialize this explainer with APA, TAG, and the wider web platform community.
2. Discuss ARIA role proposals and `aria-details` usage with the ARIA Working Group.
3. Create samples HTML, EPUB and web publications demonstrating the recommended patterns.
4. Produce authoring guidance and lint rules to encourage correct usage and prevent misuse.
5. Coordinate with reading system and assistive technology vendors on implementation and UX affordances.

## References

- [Standardizing Extended Descriptions: User Stories, Testing Results, and Current Limitations](https://github.com/w3c/epub-specs/wiki/Standardizing-Extended-Descriptions:-User-Stories,-Testing-Results,-and-Current-Limitations/)
- [Extended Descriptions Use Cases and Reading System Expectations](https://github.com/w3c/publ-a11y/wiki/Extended-Descriptions-Use-Cases-and-Reading-System-Expectations)
- [Best Practices for Authoring Extended Descriptions in EPUB](https://daisy.github.io/transitiontoepub/best-practices/extended-desc/index.html)
- [WCAG 2.2 — Non-text Content](https://www.w3.org/TR/WCAG22/#non-text-content)
- [ARIA `aria-details` Attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-details)
- [POC: Extended Description](https://github.com/daisy/transitiontoepub/tree/main/experiments/extended-desc)

## Acknowledgements

This explainer has been written by Gautier Chomel summarizing previous works from Charles LaPierre and Gregorio Pellegrino, discussed and reviewed by Matthew Atkinson, Matt Garrish, George Kerscher, Steve Noble, Wendy Reid, James Yanchack, and others. All works conducted under Avneesh Singh coordination.

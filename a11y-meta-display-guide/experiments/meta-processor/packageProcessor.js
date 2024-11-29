
'use strict';

var packageProcessor = (function() {

	var result = document.getElementById('result');
	
	function processPackageDoc(package_document_as_text) {
	
		console.clear();
		result.textContent = '';
		
		/* 
		 * The specification calls the preprocessing step for every technique but that's
		 * omitted from this code. The package_document variable is only configured once
		 */  
		
		var package_document = preprocessing(package_document_as_text);
		
		if (!package_document) {
			return;
		}
		
		/* 
		 * 4.1 Visual adjustments
		 */
		 
		 // 4.1.2 Variables setup
		 var all_textual_content_can_be_modified = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="displayTransformability"]');
		 var is_fixed_layout = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="rendition:layout" and text()="pre-paginated"]');
		
		// 4.1.3 Instructions
		
		var vis_hd = document.createElement('dt');
			vis_hd.appendChild(document.createTextNode('Visual adjustments'));
		result.appendChild(vis_hd);
		
		var vis_result = document.createElement('dd');
		
		if (all_textual_content_can_be_modified) {
			vis_result.appendChild(document.createTextNode('Appearance can be modified'));
		}
		
		else if (is_fixed_layout) {
			vis_result.appendChild(document.createTextNode('Appearance cannot be modified'));
		}
		
		else {
			vis_result.appendChild(document.createTextNode('Appearance modifiability not known'));
		}
		
		result.appendChild(vis_result);
		
		
		/* 
		 * 4.2 Supports nonvisual reading
		 */
		 
		 // 4.2.2 Variables setup
		 var all_necessary_content_textual = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessModeSufficient" and text()="textual"]');
		 var non_textual_content_images = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and (text()="chartOnVisual" or text()="chemOnVisual" or text()="diagramOnVisual" or text()="mathOnVisual" or text()="musicOnVisual" or text()="textOnVisual")]');
		 var textual_alternative_images = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and (text()="longDescription" or text()="alternativeText" or text()="describedMath")]');
		
		// 4.2.3 Instructions
		
		var nonvis_hd = document.createElement('dt');
			nonvis_hd.appendChild(document.createTextNode('Supports nonvisual reading'));
		result.appendChild(nonvis_hd);
		
		var nonvis_result = document.createElement('dd');
		
		if (all_necessary_content_textual) {
			nonvis_result.appendChild(document.createTextNode('Readable in read aloud or dynamic braille'));
		}
		
		else if (non_textual_content_images && !textual_alternative_images) {
			nonvis_result.appendChild(document.createTextNode('Not fully readable in read aloud or dynamic braille'));
		}
		
		else {
			nonvis_result.appendChild(document.createTextNode('May not be fully readable in read aloud or dynamic braille'));
		}
		
		result.appendChild(nonvis_result);
		
		
		/* 
		 * 4.3 Conformance
		 */
		 
		// 4.3.2 Variables setup
		var conformance_string = '';
		var wcag_level = '';
		
		if (checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="dcterms:conformsTo" and text() = "http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a"] | /opf:package/opf:metadata/opf:link[@rel="dcterms:conformsTo" and @href="http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-a"]')) {
			conformance_string = 'EPUB Accessibility 1.0 WCAG 2.0 Level A';
			wcag_level = 'A';
		}
		
		if (checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="dcterms:conformsTo" and text() = "http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa"] | /opf:package/opf:metadata/opf:link[@rel="dcterms:conformsTo" and @href="http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa"]')) {
			conformance_string = 'EPUB Accessibility 1.0 WCAG 2.0 Level AA';
			wcag_level = 'AA';
		}
		
		if (checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="dcterms:conformsTo" and text() = "http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aaa"] | /opf:package/opf:metadata/opf:link[@rel="dcterms:conformsTo" and @href="http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aaa"]')) {
			conformance_string = 'EPUB Accessibility 1.0 WCAG 2.0 Level AAA';
			wcag_level = 'AAA';
		}
		
		// js evaluate() can't handle this expression /opf:package/opf:metadata/opf:meta[@property="dcterms:conformsTo" and matches(text(), "EPUB Accessibility 1\.1 - WCAG 2\.[0-2] Level [A]+")]
		// using contains() instead to match most of it
		
		var conformance = package_document.evaluate('/opf:package/opf:metadata/opf:meta[@property="dcterms:conformsTo" and contains(text(), "EPUB Accessibility 1.1 - WCAG 2.")]', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		
		if (conformance) {
			conformance_string = conformance.replace(' - ', ' ');
			wcag_level = conformance.replace('EPUB Accessibility 1\.1 - WCAG 2\.[0-2] Level ', '');
		}
		
		var certifier = package_document.evaluate('/opf:package/opf:metadata/opf:meta[@property="a11y:certifiedBy"]/text()', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var certifier_credentials = package_document.evaluate('/opf:package/opf:metadata/opf:meta[@property="a11y:certifierCredential"]/text()', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var certification_date = package_document.evaluate('/opf:package/opf:metadata/opf:meta[@property="dcterms:date" and @refines=//opf:meta[@property="a11y:certifiedBy"]/@id]', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var certifier_report = package_document.evaluate('/opf:package/opf:metadata/opf:meta[@property="a11y:certifierReport"]/text()', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		
		// 4.3.3 Instructions
		
		var conf_hd = document.createElement('dt');
			conf_hd.appendChild(document.createTextNode('Conformance'));
		result.appendChild(conf_hd);
		
		var conf_result = document.createElement('dd');
		
		if (conformance_string) {
			
			var conf_p = document.createElement('p');
			
			if (wcag_level == 'AAA') {
				conf_p.appendChild(document.createTextNode('This publication exceeds accepted accessibility standards'));
			}
			
			else if (wcag_level == 'AA') {
				conf_p.appendChild(document.createTextNode('This publication meets accepted accessibility standards'));
			}
			
			else if (wcag_level == 'A') {
				conf_p.appendChild(document.createTextNode('This publication meets minimum accessibility standards'));
			}
			
			conf_result.appendChild(conf_p);
			
			
			
			if (certifier) {
				var cert_p = document.createElement('p');
				cert_p.appendChild(document.createTextNode('This publication is certified by '));
				cert_p.appendChild(document.createTextNode(certifier));
				conf_result.appendChild(cert_p);
			}
			
			if (certifier_credentials) {
				
				var cred_p = document.createElement('p');
				
				cred_p.appendChild(document.createTextNode('The certifier\'s credential is '));
				
				if (certifier_credentials.match('^http')) {
					var cert_link = document.createElement('a');
						cert_link.href = certifier_credentials;
						cert_link.appendChild(document.createTextNode(certifier_credentials));
					cred_p.appendChild(cert_link);
				}
				
				else {
					cred_p.appendChild(document.createTextNode(certifier_credentials));
				}
				
				conf_result.appendChild(cred_p);
			}
			
			result.appendChild(conf_result);
			
			var detconf_hd = document.createElement('dt');
				detconf_hd.appendChild(document.createTextNode('Detailed Conformance Information'));
			result.appendChild(detconf_hd);
			
			var detconf_result = document.createElement('dd');
			
			var conf_p = document.createElement('p');
				conf_p.appendChild(document.createTextNode('This publication claims to meet '));
				conf_p.appendChild(document.createTextNode(conformance_string));
			
			detconf_result.appendChild(conf_p);
			
			var cert_p = document.createElement('p');
			
			if (certification_date || certifier || certifier_credentials) {
				cert_p.appendChild(document.createTextNode('The publication was certified '));
			}
			
			if (certification_date) {
				cert_p.appendChild(document.createTextNode(' on '));
				cert_p.appendChild(document.createTextNode(certification_date));
			}
			
			if (certifier) {
				cert_p.appendChild(document.createTextNode(' by '));
				cert_p.appendChild(document.createTextNode(certifier));
			}
			
			if (certifier_credentials) {
				cert_p.appendChild(document.createTextNode(' with a credential of '));
				
				if (certifier_credentials.match('^http')) {
					var cert_link = document.createElement('a');
						cert_link.href = certifier_credentials;
						cert_link.appendChild(document.createTextNode(certifier_credentials));
					cert_p.appendChild(cert_link);
				}
				
				else {
					cert_p.appendChild(document.createTextNode(certifier_credentials));
				}
			}
			
			detconf_result.appendChild(cert_p);
			
			if (certifier_report) {
				
				var rep_p = document.createElement('p');
				
				rep_p.appendChild(document.createTextNode('For more information refer to the certifier\'s report '));
				
				var rep_link = document.createElement('a');
					rep_link.href = certifier_credentials;
					rep_link.appendChild(document.createTextNode(certifier_report));
				rep_p.appendChild(rep_link);
				
				detconf_result.appendChild(rep_p);
			}
			
			result.appendChild(detconf_result);
		}
		
		
		else {
			conf_result.appendChild(document.createTextNode('The publication does not include a conformance statement'));
			result.appendChild(conf_result);
		}
		

		/* 
		 * 4.4 Prerecorded audio
		 */
		 
		// 4.4.2 Variables setup
		var all_content_audio = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessModeSufficient" and text()="auditory"]');
		var synchronised_pre_recorded_audio = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="sychronizedAudioText"]');
		var audio_content = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessMode" and text()="auditory"]');
		
		// 4.4.3 Instructions
		
		var prerec_hd = document.createElement('dt');
			prerec_hd.appendChild(document.createTextNode('Prerecorded audio'));
		result.appendChild(prerec_hd);
		
		var prerec_result = document.createElement('dd');
		
		if (all_content_audio) {
			prerec_result.appendChild(document.createTextNode('Audio only'));
		}
		
		else if (synchronised_pre_recorded_audio) {
			prerec_result.appendChild(document.createTextNode('Synchronized audio and text'));
		}
		
		else if (audio_content) {
			prerec_result.appendChild(document.createTextNode('Complementary audio and text'));
		}
		
		else {
			prerec_result.appendChild(document.createTextNode('No information about pre-recorded audio is available'));
		}
		
		result.appendChild(prerec_result);
		
		
		/* 
		 * 4.5 Navigation
		 */
		 
		// 4.5.2 Variables setup
		var table_of_contents_navigation = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="tableOfContents"]');
		var index_navigation = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="index"]');
		var page_navigation = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="pageNavigation"]');
		var next_previous_structural_navigation = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="structuralNavigation"]');
		
		// 4.5.3 Instructions
		
		var nav_hd = document.createElement('dt');
			nav_hd.appendChild(document.createTextNode('Navigation'));
		result.appendChild(nav_hd);
		
		var nav_result = document.createElement('dd');
		
		if (table_of_contents_navigation || index_navigation || page_navigation || next_previous_structural_navigation) {
			
			var navigation = [];
			
			if (table_of_contents_navigation) {
				navigation.push("table of contents");
			}
			
			if (index_navigation) {
				navigation.push("index");
			}
			
			if (page_navigation) {
				navigation.push("supports page navigation");
			}
			
			if (next_previous_structural_navigation) {
				navigation.push("headings");
			}
			
			var navigation_string = joinArray(navigation);
				navigation_string = "Navigation by " + navigation_string;
			
			nav_result.appendChild(document.createTextNode(navigation_string));
		}
		
		else {
			nav_result.appendChild(document.createTextNode('No information about navigation is available'));
		}
		
		result.appendChild(nav_result);
		
		
		/* 
		 * 4.6 Charts, diagrams, math, and formulas
		 */
		 
		 // 4.6.2 Variables setup
		var contains_charts_diagrams  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="chartOnVisual"]');
		var long_text_descriptions  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="longDescriptions"]');
		var contains_chemical_formula  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="chemOnVisual"]');
		var chemical_formula_as_chemml  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="ChemML"]');
		var contains_math_formula  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="describedMath"]');
		var math_formula_as_latex  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="latex"]');
		var math_formula_as_mathml  = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="MathML"]');
		
		// 4.6.3 Instructions
		
		var cdmf_hd = document.createElement('dt');
			cdmf_hd.appendChild(document.createTextNode('Charts, diagrams, math, and formulas'));
		result.appendChild(cdmf_hd);
		
		var cdmf_result = document.createElement('dd');
		
		if (contains_charts_diagrams && long_text_descriptions) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Charts and diagrams have extended descriptions'));
			cdmf_result.appendChild(p);
		}
		
		if (chemical_formula_as_chemml) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Accessible chemistry content'));
			cdmf_result.appendChild(p);
		}
		
		if (math_formula_as_latex || math_formula_as_mathml) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Accessible math content'));
			cdmf_result.appendChild(p);
		}
		
		if ((contains_charts_diagrams || contains_chemical_formula || contains_math_formula) && !(long_text_descriptions || chemical_formula_as_chemml || math_formula_as_latex || math_formula_as_mathml)) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('accessibility of formulas, charts, math, and diagrams not identified as being accessible'));
			cdmf_result.appendChild(p);
		}
		
		result.appendChild(cdmf_result);
		
		
		/* 
		 * 4.7 Hazards
		 */
		 
		 // 4.7.2 Variables setup
		var no_hazards_or_warnings_confirmed = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="none"]');
		var flashing_hazard = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="flashing"]');
		var no_flashing_hazards = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="noFlashingHazard"]');
		var motion_simulation_hazard = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="motionSimulation"]');
		var no_motion_hazards = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="noMotionSimulation"]');
		var sound_hazard = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="sound"]');
		var no_sound_hazards = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="noSoundHazard"]');
		var unknown_if_contains_hazards = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityHazard" and text()="unknown"]');
		
		// 4.7.3 Instructions
		
		var haz_hd = document.createElement('dt');
			haz_hd.appendChild(document.createTextNode('Hazards'));
		result.appendChild(haz_hd);
		
		var haz_result = document.createElement('dd');
		
		if (no_hazards_or_warnings_confirmed || (no_flashing_hazards && no_motion_hazards && no_sound_hazards)) {
			haz_result.appendChild(document.createTextNode('No hazards'));
		}
		
		else if (flashing_hazard || motion_simulation_hazard || sound_hazard) {
		
			var hazards = [];
		
			if (flashing_hazard) {
				hazards.push('flashing');
			}
			
			if (motion_simulation_hazard) {
				hazards.push('motion simulation');
			}
			
			if (sound_hazard) {
				hazards.push('sound');
			}
			
			var hazards_string = joinArray(hazards);
				hazards_string = String(hazards_string).charAt(0).toUpperCase() + String(hazards_string).slice(1);
			
			if (hazards.length > 1) {
				hazards_string = hazards_string + ' hazards';	
			}
			else {
				hazards_string = hazards_string + ' hazard';	
			}
			
			haz_result.appendChild(document.createTextNode(hazards_string));
		}

		else if (unknown_if_contains_hazards) {
			haz_result.appendChild(document.createTextNode('The presence of hazards is unknown'));
		}
		
		else {
			haz_result.appendChild(document.createTextNode('No information about possible hazards is available'));
		}
		
		result.appendChild(haz_result);
		
		
		/* 
		 * 4.8 Accessibility summary
		 */
		 
		 // 4.8.2 Variables setup
		var accessibility_summary =  package_document.evaluate('/opf:package/opf:metadata/opf:meta[@property="schema:accessibilitySummary"]', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var lang_attribute_accessibility_summary = package_document.evaluate('(/opf:package/opf:metadata/opf:meta[@property="schema:accessibilitySummary"]/@xml:lang | /opf:package/@xml:lang)[last()]', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var language_of_text = package_document.evaluate('/opf:package/opf:metadata/dc:language[1]/text()', package_document, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		
		// 4.8.3 Instructions
		
		var sum_hd = document.createElement('dt');
			sum_hd.appendChild(document.createTextNode('Accessibility summary'));
		result.appendChild(sum_hd);
		
		var sum_result = document.createElement('dd');
		
		var language_accessibility_summary;
		
		if (lang_attribute_accessibility_summary) {
			language_accessibility_summary = lang_attribute_accessibility_summary;
		}
		
		else {
			language_accessibility_summary = language_of_text;
		}
		
		if (accessibility_summary) {
			sum_result.appendChild(document.createTextNode(accessibility_summary));
			sum_result.lang = language_accessibility_summary;
		}
		
		else {
			sum_result.appendChild(document.createTextNode('No accessibility summary is available'));
		}
		
		result.appendChild(sum_result);
		
		
		/* 
		 * 4.9 Legal considerations
		 */
		 
		 // 4.9.2 Variables setup
		var eaa_exemption_micro_enterprises = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="a11y:exemption" and text()="eaa-microenterprise"]');
		var eaa_exception_disproportionate_burden = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="a11y:exemption" and text()="eaa-disproportionate-burden"]');
		var eaa_exception_fundamental_modification = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="a11y:exemption" and text()="eaa-fundamental-alteration"]');
		
		// 4.9.3 Instructions
		
		var legal_hd = document.createElement('dt');
			legal_hd.appendChild(document.createTextNode('Legal considerations'));
		result.appendChild(legal_hd);
		
		var legal_result = document.createElement('dd');
		
		if (eaa_exemption_micro_enterprises || eaa_exception_disproportionate_burden || eaa_exception_fundamental_modification) {
			legal_result.appendChild(document.createTextNode('TBD'));
		}
		
		else {
			legal_result.appendChild(document.createTextNode('No legal considerations'));
		}
		
		result.appendChild(legal_result);
		
		
		/* 
		 * 4.10 Additional accessibility information
		 */
		 
		var aai_hd = document.createElement('dt');
			aai_hd.appendChild(document.createTextNode('Additional accessibility information'));
		result.appendChild(aai_hd);
		
		var aai_result = document.createElement('dd');
		
		// 4.10.1 Adaptation
		// 4.10.1.2 Variables setup
		var audio_descriptions = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="audioDescription"]');
		var braille = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="braille"]');
		var closed_captions = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="closedCaptions"]');
		var open_captions = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="openCaptions"]');
		var tactile_graphic = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="tactileGraphic"]');
		var tactile_object = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="tactileObject"]');
		var transcript = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="transcript"]');
		var sign_language = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="signLanguage"]');
		
		// 4.10.1.3 Instructions
		
		var adaptation = [];
		
		if (audio_descriptions) {
			adaptation.push('audio descriptions');
		}
		
		if (braille) {
			adaptation.push('braille');
		}
		
		if (closed_captions) {
			adaptation.push('closed captions');
		}
		
		if (open_captions) {
			adaptation.push('open captions');
		}
		
		if (tactile_graphic) {
			adaptation.push('tactile graphic');
		}
		
		if (tactile_object) {
			adaptation.push('tactile 3D object');
		}
		
		if (transcript) {
			adaptation.push('transcript');
		}
		
		if (sign_language) {
			adaptation.push('sign language');
		}
		
		if (adaptation.length) {
			var adaptation_string = joinArray(adaptation);
				adaptation_string = String(adaptation_string).charAt(0).toUpperCase() + String(adaptation_string).slice(1);

			aai_result.appendChild(document.createTextNode('Adaptability: ' + adaptation_string));
		}
		
		// 4.10.2 Clarity
		// 4.10.2.2 Variables setup
		var aria = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="aria"]');
		var full_ruby_annotations = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="fullRubyAnnotations"]');
		var text_to_speech_hinting = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="ttsMarkup"]');
		var high_contrast_between_foreground_and_background_audio = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="highContrastAudio"]');
		var high_contrast_between_text_and_background = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="highContrastDisplay"]');
		var large_print = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="largePrint"]');
		var page_break_markers = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="pageBreakMarkers"]');
		var ruby_annotations = checkForNode(package_document, '/opf:package/opf:metadata/opf:meta[@property="schema:accessibilityFeature" and text()="rubyAnnotations"]');
		
		// 4.10.2.3 Instructions
		
		var clarity = [];
		
		if (aria) {
			clarity.push('aria');
		}
		
		if (full_ruby_annotations) {
			clarity.push('full ruby annotations');
		}
		
		if (text_to_speech_hinting) {
			clarity.push('text-to-speech hinting provided');
		}
		
		if (high_contrast_between_foreground_and_background_audio) {
			clarity.push('high contrast between foreground and background audio');
		}
		
		if (high_contrast_between_text_and_background) {
			clarity.push('high contrast between text and background');
		}
		
		if (large_print) {
			clarity.push('large print');
		}
		
		if (page_break_markers) {
			clarity.push('page breaks');
		}
		
		if (ruby_annotations) {
			clarity.push('ruby annotations');
		}
		
		if (clarity.length) {
			var clarity_string = joinArray(adaptation);
				clarity_string = String(clarity_string).charAt(0).toUpperCase() + String(clarity_string).slice(1);

			aai_result.appendChild(document.createTextNode('Clarity: ' + clarity_string));
		}
	}
	
	// 3.1 Preprocessing
	
	function preprocessing(package_document_as_text) {
		
		var package_document;
		
		try {
			var parser = new DOMParser();
			package_document = parser.parseFromString(package_document_as_text, "text/xml");
		}
		
		catch (e) {
			alert('Error parsing package document: ' + e);
			package_document = null;
		}
		
		return package_document;
	}
	
	
	// 3.2 Check for node
	
	function checkForNode(package_document, path) {
		var result = package_document.evaluate(path, package_document, nsResolver, XPathResult.BOOLEAN_TYPE, null);
		return result.booleanValue;
	}
	
	function nsResolver(prefix) {
		switch (prefix) {
			case 'xml':
				return 'http://www.w3.org/XML/1998/namespace';
			default:
				return "http://www.idpf.org/2007/opf";
		}
	}	
	
	// 3.3 Join array to comma list
	
	function joinArray(string_array) {
		var output_string = string_array.join(', ');
			output_string = output_string.replace(/, ([^,]+)$/, ', and $1');
			return output_string;
	}
	
	return {
		processPackageDoc: function(packageDoc) {
			return processPackageDoc(packageDoc);
		}
	}

})();

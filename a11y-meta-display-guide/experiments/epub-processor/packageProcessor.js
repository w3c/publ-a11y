
'use strict';

var packageProcessor = (function() {

	// var bcp47 = new RegExp('^((?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?:([A-Za-z]{2,3}(-(?:[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-(?:[A-Za-z]{4}))?(-(?:[A-Za-z]{2}|[0-9]{3}))?(-(?:[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-(?:[0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(?:x(-[A-Za-z0-9]{1,8})+))?)|(?:x(-[A-Za-z0-9]{1,8})+))$');
	// regex works for general cases, but haven't tested in depth 
	// var dateTime = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])(T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{3})?(Z)?)?$');
	
	var result = document.getElementById('result');
	
	function processPackageDoc() {
	
		console.clear();
		result.textContent = '';
		
		/* 
		 * The specification calls the preprocessing step for every technique but that's
		 * omitted from this code. The package_document variable is only configured once
		 */  
		
		var package_document_as_text = document.getElementById('input_packagedoc').value;
		var package_document = preprocessing(package_document_as_text);
		
		/* 
		 * the following tests are not in the spec but are added to make sure the input is actually a package document
		 */
		
		if (package_document.documentElement.nodeName !== 'package') {
			console.error('Invalid package document - root element is not package');
			return;
		}
		
		var meta_xml = package_document.documentElement.childNodes[0];
		
		if (package_document.documentElement.childNodes[0].nodeType === Node.TEXT_NODE) {
			meta_xml = package_document.documentElement.childNodes[1];
		} 
		
		if (!meta_xml || meta_xml.nodeName !== 'metadata') {
			console.error('Invalid package document - metadata element not found or is not the first child');
			return;
		}
		
		/* end of app-specific validation */
		 
		 
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
		 var all_necessary_content_textual = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessModeSufficient" and text()="textual"]');
		 var non_textual_content_images = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and (text()="chartOnVisual" or text()="chemOnVisual" or text()="diagramOnVisual" or text()="mathOnVisual" or text()="musicOnVisual" or text()="textOnVisual")]');
		 var textual_alternative_images = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and (text()="longDescription" or text()="alternativeText" or text()="describedMath")]');
		
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
		 
		 // Todo

		
		/* 
		 * 4.4 Pre-recorded audio
		 */
		 
		 // 4.4.2 Variables setup
		 var all_content_audio = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessModeSufficient" and text()="auditory"]');
		 var synchronised_pre_recorded_audio = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="sychronizedAudioText"]');
		 var audio_content = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessMode" and text()="auditory"]');
		
		// 4.4.3 Instructions
		
		var prerec_hd = document.createElement('dt');
			prerec_hd.appendChild(document.createTextNode('Pre-recorded audio'));
		result.appendChild(prerec_hd);
		
		var prerec_result = document.createElement('dd');
		
		if ( all_content_audio) {
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
		 var table_of_contents_navigation = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="tableOfContents"]');
		 var index_navigation = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="index"]');
		 var page_navigation = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="pageNavigation"]');
		 var next_previous_structural_navigation = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="structuralNavigation"]');
		
		// 4.5.3 Instructions
		
		var nav_hd = document.createElement('dt');
			nav_hd.appendChild(document.createTextNode('Navigation'));
		result.appendChild(nav_hd);
		
		var nav_result = document.createElement('dd');
		
		if (table_of_contents_navigation || index_navigation || page_navigation || next_previous_structural_navigation) {
			
			var navigation = [];
			
			if (table_of_contents_navigation) {
				navigation.append("table of contents");
			}
			
			if (index_navigation) {
				navigation.append("index");
			}
			
			if (page_navigation) {
				navigation.append("supports page navigation");
			}
			
			if (next_previous_structural_navigation) {
				navigation.append("headings");
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
		var contains_charts_diagrams  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="chartOnVisual"]');
		var long_text_descriptions  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="longDescriptions"]');
		var contains_chemical_formula  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="chemOnVisual"]');
		var chemical_formula_as_chemml  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="ChemML"]');
		var contains_math_formula  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="describedMath"]');
		var math_formula_as_latex  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="latex"]');
		var math_formula_as_mathml  = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="MathML"]');
		
		// 4.6.3 Instructions
		
		var cdmf_hd = document.createElement('dt');
			cdmf_hd.appendChild(document.createTextNode('Charts, diagrams, math, and formulas'));
		result.appendChild(cdmf_hd);
		
		var cdmf_result = document.createElement('dd');
		
		if (contains_charts_diagrams && long_text_descriptions) {
			cdmf_result.appendChild(document.createTextNode('Charts and diagrams have extended descriptions'));
		}
		
		if (chemical_formula_as_chemml) {
			cdmf_result.appendChild(document.createTextNode('Accessible chemistry content'));
		}
		
		if (math_formula_as_latex || math_formula_as_mathml) {
			cdmf_result.appendChild(document.createTextNode('Accessible math content'));
		}
		
		if ((contains_charts_diagrams || contains_chemical_formula || contains_math_formula) && !(long_text_descriptions || chemical_formula_as_chemml || math_formula_as_latex || math_formula_as_mathml)) {
			cdmf_result.appendChild(document.createTextNode('accessibility of formulas, charts, math, and diagrams not identified as being accessible'));
		}
		
		result.appendChild(cdmf_result);
		
		
		/* 
		 * 4.7 Hazards
		 */
		 
		 // 4.7.2 Variables setup
		var no_hazards_or_warnings_confirmed = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="none"]');
		var flashing_hazard = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="flashing"]');
		var no_flashing_hazards = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="noFlashingHazard"]');
		var motion_simulation_hazard = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="motionSimulation"]');
		var no_motion_hazards = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="noMotionSimulation"]');
		var sound_hazard = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="sound"]');
		var no_sound_hazards = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="noSoundHazard"]');
		var unknown_if_contains_hazards = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityHazard" and text()="unknown"]');
		
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
				hazards.append('flashing');
			}
			
			if (motion_simulation_hazard) {
				hazards.append('motion simulation');
			}
			
			if (sound_hazard) {
				hazards.append('sound');
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
		var accessibility_summary = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilitySummary"]');
		var lang_attribute_accessibility_summary = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilitySummary"]/@lang|/package/metadata/meta[@property="schema:accessibilitySummary"]/ancestor::*/@lang[last()]');
		var language_of_text = checkForNode(package_document, '/package/metadata/dc:language[1]/text()');
		
		// 4.8.3 Instructions
		
		var sum_hd = document.createElement('dt');
			sum_hd.appendChild(document.createTextNode('Accessibility summary'));
		result.appendChild(sum_hd);
		
		var sum_result = document.createElement('dd');
		
		var language_accessibility_summary
		
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
		var eaa_exemption_micro_enterprises = checkForNode(package_document, '/package/metadata/meta[@property="a11y:exemption" and text()="eaa-microenterprise"]');
		var eaa_exception_disproportionate_burden = checkForNode(package_document, '/package/metadata/meta[@property="a11y:exemption" and text()="eaa-disproportionate-burden"]');
		var eaa_exception_fundamental_modification = checkForNode(package_document, '/package/metadata/meta[@property="a11y:exemption" and text()="eaa-fundamental-alteration"]');
		
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
		var audio_descriptions = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="audioDescription"]');
		var braille = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="braille"]');
		var closed_captions = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="closedCaptions"]');
		var open_captions = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="openCaptions"]');
		var tactile_graphic = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="tactileGraphic"]');
		var tactile_object = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="tactileObject"]');
		var transcript = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="transcript"]');
		var sign_language = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="signLanguage"]');
		
		// 4.10.1.3 Instructions
		
		var adaptation = [];
		
		if (audio_descriptions) {
			adaptation.append('audio descriptions');
		}
		
		if (braille) {
			adaptation.append('braille');
		}
		
		if (closed_captions) {
			adaptation.append('closed captions');
		}
		
		if (open_captions) {
			adaptation.append('open captions');
		}
		
		if (tactile_graphic) {
			adaptation.append('tactile graphic');
		}
		
		if (tactile_object) {
			adaptation.append('tactile 3D object');
		}
		
		if (transcript) {
			adaptation.append('transcript');
		}
		
		if (sign_language) {
			adaptation.append('sign language');
		}
		
		if (adaptation.length) {
			var adaptation_string = joinArray(adaptation);
				adaptation_string = String(adaptation_string).charAt(0).toUpperCase() + String(adaptation_string).slice(1);

			aai_result.appendChild(document.createTextNode('Adaptability: ' + adaptation_string));
		}
		
		// 4.10.2 Clarity
		// 4.10.2.2 Variables setup
		var aria = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="aria"]');
		var full_ruby_annotations = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="fullRubyAnnotations"]');
		var text_to_speech_hinting = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="ttsMarkup"]');
		var high_contrast_between_foreground_and_background_audio = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="highContrastAudio"]');
		var high_contrast_between_text_and_background = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="highContrastDisplay"]');
		var large_print = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="largePrint"]');
		var page_break_markers = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="pageBreakMarkers"]');
		var ruby_annotations = checkForNode(package_document, '/package/metadata/meta[@property="schema:accessibilityFeature" and text()="rubyAnnotations"]');
		
		// 4.10.2.3 Instructions
		
		var clarity = [];
		
		if (aria) {
			clarity.append('aria" to clarity');
		}
		
		if (full_ruby_annotations) {
			clarity.append('full ruby annotations" to clarity');
		}
		
		if (text_to_speech_hinting) {
			clarity.append('text-to-speech hinting provided" to clarity');
		}
		
		if (high_contrast_between_foreground_and_background_audio) {
			clarity.append('high contrast between foreground and background audio" to clarity');
		}
		
		if (high_contrast_between_text_and_background) {
			clarity.append('high contrast between text and background" to clarity');
		}
		
		if (large_print) {
			clarity.append('large print" to clarity');
		}
		
		if (page_break_markers) {
			clarity.append('page breaks" to clarity');
		}
		
		if (ruby_annotations) {
			clarity.append('ruby annotations" to clarity');
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
			console.error('Error parsing package document: ' + e);
			package_document = null;
		}
		
		return package_document;
	}
	
	
	// 3.2 Check for node
	
	function checkForNode(package_document, path) {
		var result = package_document.evaluate(path, package_document, nsResolver, XPathResult.BOOLEAN_TYPE, null);
		return result.booleanValue;
	}
	
	function nsResolver() { return "http://www.idpf.org/2007/opf"; }
	
	
	// 3.3 Join array to comma list
	
	function joinArray(string_array) {
		var output_string = join(string_array, ', ');
			output_string = output_string.replace(/, ([^,]+)$/, ', and $1');
			return output_string;
	}
	
	return {
		processPackageDoc: function() {
			return processPackageDoc();
		}
	}

})();

	
	function union(setA, setB) {
		var _union = new Set(setA);
		for (var elem of setB) {
		    _union.add(elem);
		}
		return _union;
	}

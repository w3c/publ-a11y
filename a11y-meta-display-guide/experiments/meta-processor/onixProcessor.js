
'use strict';

var onixProcessor = (function() {

	var result = document.getElementById('result');
	
	function processOnixRecord(onix_record_as_text) {
	
		console.clear();
		result.textContent = '';
		
		/* 
		 * The specification calls the preprocessing step for every technique but that's
		 * omitted from this code. The onix variable is only configured once
		 */  
		
		var onix = preprocessing(onix_record_as_text);
		
		if (!onix) {
			return;
		}
		
		/* 
		 * 4.1 Visual adjustments
		 */
		 
		 // 4.1.2 Variables setup
		 var all_textual_content_can_be_modified = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "36"]');
		 var is_fixed_layout = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormDetail[text() = "E201"]') && !checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormDetail[text() = "E200"]');
		
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
		 var all_necessary_content_textual = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "52"]');
		 var real_text = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:PrimaryContentType = "10" or onix:ProductContentType = "10"]');
		 var non_textual_content_images = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:PrimaryContentType = "07" or onix:PrimaryContentType = "18" or onix:PrimaryContentType = "19" or onix:PrimaryContentType = "12" or onix:PrimaryContentType = "49" or onix:PrimaryContentType = "20" or onix:ProductContentType = "07" or onix:ProductContentType = "18" or onix:ProductContentType = "19" or onix:ProductContentType = "12" or onix:ProductContentType = "49" or onix:ProductContentType = "20"]');
		 var textual_alternative_images = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and (onix:ProductFormFeatureValue = "14" or onix:ProductFormFeatureValue = "15" or onix:ProductFormFeatureValue = "16")]');
		
		// 4.2.3 Instructions
		
		var nonvis_hd = document.createElement('dt');
			nonvis_hd.appendChild(document.createTextNode('Supports nonvisual reading'));
		result.appendChild(nonvis_hd);
		
		var nonvis_result = document.createElement('dd');
		
		if (all_necessary_content_textual) {
			nonvis_result.appendChild(document.createTextNode('Readable in read aloud or dynamic braille'));
		}
		
		else if (real_text && non_textual_content_images && !textual_alternative_images) {
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
		var epub_accessibility_10 = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "02"]')  || checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "03"]');
		var epub_accessibility_11 = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "04"]');
		var wcag_20 = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "80"]') || checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "02"]') || checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "03"]');
		var wcag_21 = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "81"]');
		var wcag_22 = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "82"]');
		var level_a = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "84"]') || checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "02"]');
		var level_aa = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "85"]') || checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "03"]');
		var level_aaa = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "86"]');
		var certifier  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "90"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var certifier_credentials  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "93"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var certification_date  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "91"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var certifier_report  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "94"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		
		// 4.3.3 Instructions
		
		var conf_hd = document.createElement('dt');
			conf_hd.appendChild(document.createTextNode('Conformance'));
		result.appendChild(conf_hd);
		
		var conf_result = document.createElement('dd');
		
		var conf_p = document.createElement('p');
		
		if (level_aaa) {
			conf_p.appendChild(document.createTextNode('This publication exceeds accepted accessibility standards'));
		}
		
		else if (level_aa) {
			conf_p.appendChild(document.createTextNode('This publication meets accepted accessibility standards'));
		}
		
		else if (level_a) {
			conf_p.appendChild(document.createTextNode('This publication meets minimum accessibility standards'));
		}
		
		else {
			conf_p.appendChild(document.createTextNode('The publication does not include a conformance statement'));
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
		
		if (epub_accessibility_10 || epub_accessibility_11 || wcag_20 || wcag_21 || wcag_22 || level_aaa || level_aa || level_a) {
			conf_p.appendChild(document.createTextNode('This publication claims to meet '));
		}
		
		if (epub_accessibility_10) {
			conf_p.appendChild(document.createTextNode(' EPUB Accessibility 1.0 '));
		}
		
		else if (epub_accessibility_11) {
			conf_p.appendChild(document.createTextNode(' EPUB Accessibility 1.1 '));
		}
		
		if (wcag_22) {
			conf_p.appendChild(document.createTextNode(' WCAG 2.2 '));
		}
		
		else if (wcag_21) {
			conf_p.appendChild(document.createTextNode(' WCAG 2.1 '));
		}
		
		else if (wcag_20) {
			conf_p.appendChild(document.createTextNode(' WCAG 2.0 '));
		}
		
		if (level_aaa) {
			conf_p.appendChild(document.createTextNode(' Level AAA'));
		}
			
		else if (level_aa) {
			conf_p.appendChild(document.createTextNode(' Level AA'));
		}
		
		else if (level_a) {
			conf_p.appendChild(document.createTextNode(' Level A'));
		}
		
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
		

		/* 
		 * 4.4 Pre-recorded audio
		 */
		 
		 // 4.4.2 Variables setup
		 var audiobook = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:DescriptiveDetail[onix:PrimaryContentType = "81" or onix:ContentType = "81"]');
		 var all_content_audio = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "39"]');
		 var all_content_pre_recorded = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "51"]');
		 var synchronised_pre_recorded_audio = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "20"]') && checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormDetail[text() = "A305"]');
		 var non_textual_content_audio = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:DescriptiveDetail[onix:ContentType = "21" or onix:ContentType = "22"]');
		 var non_textual_content_audio_in_video = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:DescriptiveDetail[onix:ContentType = "06" or onix:ContentType = "25" or onix:ContentType = "26" or onix:ContentType = "27" or onix:ContentType = "28" or onix:ContentType = "29" or onix:ContentType = "30"]');
		
		// 4.4.3 Instructions
		
		var prerec_hd = document.createElement('dt');
			prerec_hd.appendChild(document.createTextNode('Prerecorded audio'));
		result.appendChild(prerec_hd);
		
		var prerec_result = document.createElement('dd');
		
		if (all_content_audio && !synchronised_pre_recorded_audio) {
			prerec_result.appendChild(document.createTextNode('Audio only'));
		}
		
		else if ((audiobook || non_textual_content_audio || non_textual_content_audio_in_video) && !all_content_pre_recorded) {
			prerec_result.appendChild(document.createTextNode('Complementary audio and text'));
		}
		
		else if (all_content_pre_recorded && synchronised_pre_recorded_audio) {
			prerec_result.appendChild(document.createTextNode('Synchronized audio and text'));
		}
		
		else {
			prerec_result.appendChild(document.createTextNode('No information about pre-recorded audio is available'));
		}
		
		result.appendChild(prerec_result);
		
		
		/* 
		 * 4.5 Navigation
		 */
		 
		// 4.5.2 Variables setup
		var table_of_contents_navigation = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "11"]');
		var index_navigation = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "12"]');
		var print_equivalent_page_numbering = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "19"]');
		var next_previous_structural_navigation = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "29"]');
		
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
			
			if (print_equivalent_page_numbering) {
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
		var contains_charts_diagrams  = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:DescriptiveDetail[onix:PrimaryContentType = "19" or onix:ContentType = "19"]');
		var charts_diagrams_as_non_graphical_data = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "16"]');
		var charts_diagrams_diagrams_as_long_text = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "15"]');
		var contains_chemical_formula = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:DescriptiveDetail[onix:PrimaryContentType = "47" or onix:ContentType = "47"]');
		var chemical_formula_as_chemml = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "18"]');
		var chemical_formula_as_mathml = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "34"]');
		var contains_math_formula = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:DescriptiveDetail[onix:PrimaryContentType = "48" or onix:ContentType = "48"]');
		var math_formula_as_latex = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "35"]');
		var math_formula_as_mathml = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "17"]');
		
		// 4.6.3 Instructions
		
		var cdmf_hd = document.createElement('dt');
			cdmf_hd.appendChild(document.createTextNode('Charts, diagrams, math, and formulas'));
		result.appendChild(cdmf_hd);
		
		var cdmf_result = document.createElement('dd');
		
		if (contains_charts_diagrams && charts_diagrams_diagrams_as_long_text) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Charts and diagrams have extended descriptions'));
			cdmf_result.appendChild(p);
		}
		
		if (contains_charts_diagrams && charts_diagrams_as_non_graphical_data) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Visualized data also available as non-graphical data'));
			cdmf_result.appendChild(p);
		}
		
		if (chemical_formula_as_chemml || chemical_formula_as_mathml) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Accessible chemistry content'));
			cdmf_result.appendChild(p);
		}
		
		if (math_formula_as_latex || math_formula_as_mathml) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('Accessible math content'));
			cdmf_result.appendChild(p);
		}
		
		if ((contains_charts_diagrams || contains_chemical_formula || contains_math_formula) && !(charts_diagrams_diagrams_as_long_text || charts_diagrams_as_non_graphical_data || chemical_formula_as_chemml || chemical_formula_as_mathml || math_formula_as_latex || math_formula_as_mathml)) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode('accessibility of formulas, charts, math, and diagrams not identified as being accessible'));
			cdmf_result.appendChild(p);
		}
		
		result.appendChild(cdmf_result);
		
		
		/* 
		 * 4.7 Hazards
		 */
		 
		 // 4.7.2 Variables setup
		var no_hazards_or_warnings_confirmed = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "00"]');
		var flashing_hazard = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "13"]');
		var no_flashing_hazards = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "14"]');
		var motion_simulation_hazard = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "17"]');
		var no_motion_hazards = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "18"]');
		var sound_hazard = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "15"]');
		var no_sound_hazards = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "12" and onix:ProductFormFeatureValue = "16"]');
		var unknown_if_contains_hazards = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "08"]');
		
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
		 
		 // Note xpaths in the techniques that end in /(@lang|ancestor::*/@lang)[last()]
		 // had to be made two separate selections (.../@lang | .../ancestor::*/@lang)
		 // for compatibility with xpath 1.0 processing
		 
		 // 4.8.2 Variables setup
		var accessibility_addendum  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "92"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var lang_attribute_accessibility_addendum = onix.evaluate('(/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "92"]/onix:ProductFormFeatureDescription/@lang | /onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "92"]/onix:ProductFormFeatureDescription/ancestor::*/@lang)[last()]', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var known_limited_accessibility  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "09"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var lang_known_limited_accessibility = onix.evaluate('(/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "09"]/onix:ProductFormFeatureDescription/@lang | /onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "09"]/onix:ProductFormFeatureDescription/ancestor::*/@lang)[last()]', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var accessibility_summary  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "00"]/onix:ProductFormFeatureDescription', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var lang_attribute_accessibility_summary = onix.evaluate('(/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "00"]/onix:ProductFormFeatureDescription/@lang | /onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "00"]/onix:ProductFormFeatureDescription/ancestor::*/@lang)[last()]', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		var language_of_text  = onix.evaluate('/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:Language[onix:LanguageRole="01"]/onix:LanguageCode', onix, nsResolver, XPathResult.STRING_TYPE, null).stringValue;
		
		// 4.8.3 Instructions
		
		var sum_hd = document.createElement('dt');
			sum_hd.appendChild(document.createTextNode('Accessibility summary'));
		result.appendChild(sum_hd);
		
		var sum_result = document.createElement('dd');
		
		var language_accessibility_addendum;
		var language_known_limited_accessibility;
		var language_accessibility_summary;
		
		if (lang_attribute_accessibility_addendum) {
			language_accessibility_addendum = lang_attribute_accessibility_addendum;
		}
		
		else {
			language_accessibility_addendum = language_of_text;
		}
		
		if (lang_known_limited_accessibility) {
			language_known_limited_accessibility = lang_known_limited_accessibility;
		}
		
		else {
			language_known_limited_accessibility = language_of_text;
		}
		
		if (lang_attribute_accessibility_summary) {
			language_accessibility_summary = lang_attribute_accessibility_summary;
		}
		
		else {
			language_accessibility_summary = language_of_text;
		}
		
		if (known_limited_accessibility) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode(known_limited_accessibility));
				p.lang = language_known_limited_accessibility;
			sum_result.appendChild(p);
		}
		
		if (accessibility_addendum) {
			var p = document.createElement('p');
				P.appendChild(document.createTextNode(accessibility_addendum));
				P.lang = language_accessibility_addendum;
			sum_result.appendChild(p);
		}
		
		else if (accessibility_summary) {
			var p = document.createElement('p');
				p.appendChild(document.createTextNode(accessibility_summary));
				p.lang = language_accessibility_summary;
			sum_result.appendChild(p);
		}
		
		else {
			var p = document.createElement('p');
				P.appendChild(document.createTextNode('No accessibility summary is available'));
			sum_result.appendChild(p);
		}
		
		result.appendChild(sum_result);
		
		
		/* 
		 * 4.9 Legal considerations
		 */
		 
		 // 4.9.2 Variables setup
		var eaa_exemption_micro_enterprises = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "75"]');
		var eaa_exception_disproportionate_burden = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "76"]');
		var eaa_exception_fundamental_modification = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "77"]');
		
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
		var dyslexia_readability = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "24"]');
		var closed_captions = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:ProductFormDetail = "V210"]');
		var open_captions = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:ProductFormDetail = "V211"]');
		var full_transcript = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:ProductFormDetail = "V212"]');
		var sign_language = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:ProductFormDetail = "V213"]');
		
		// 4.10.1.3 Instructions
		
		var adaptation = [];
		
		if (dyslexia_readability) {
			adaptation.push('dyslexia readability');
		}
		
		if (closed_captions) {
			adaptation.push('closed captions');
		}
		
		if (open_captions) {
			adaptation.push('open captions');
		}
		
		if (full_transcript) {
			adaptation.push('full transcript');
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
		var text_to_speech_hinting = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "21"]');
		var color_not_sole_means_of_conveying_information = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "25"]');
		var high_contrast_between_text_and_background = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "26"]');
		var ultra_high_contrast_between_text_and_background = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "37"]');
		var visible_page_numbering = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:ProductFormDetail = "E205"]');
		var high_contrast_between_foreground_and_background_audio = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail/onix:ProductFormFeature[onix:ProductFormFeatureType = "09" and onix:ProductFormFeatureValue = "27"]');
		var without_background_sounds = checkForNode(onix, '/onix:ONIXMessage/onix:Product/onix:DescriptiveDetail[onix:ProductFormDetail = "A312"]');

		// 4.10.2.3 Instructions
		
		var clarity = [];
		
		if (text_to_speech_hinting) {
			clarity.push('text-to-speech hinting provided');
		}
		
		if (color_not_sole_means_of_conveying_information) {
			clarity.push('color is not the sole means of conveying information');
		}
		
		if (high_contrast_between_text_and_background) {
			clarity.push('high contrast between text and background');
		}
		
		if (ultra_high_contrast_between_text_and_background) {
			clarity.push('ultra high contrast between text and background');
		}
		
		if (visible_page_numbering) {
			clarity.push('visible page numbering');
		}
		
		if (high_contrast_between_foreground_and_background_audio) {
			clarity.push('high contrast between foreground and background audio');
		}
		
		if (without_background_sounds) {
			clarity.push('without background sounds');
		}
		
		if (clarity.length) {
			var clarity_string = joinArray(adaptation);
				clarity_string = String(clarity_string).charAt(0).toUpperCase() + String(clarity_string).slice(1);

			aai_result.appendChild(document.createTextNode('Clarity: ' + clarity_string));
		}
	}
	
	// 3.1 Preprocessing
	
	function preprocessing(onix_record_as_text) {
		
		var onix;
		
		try {
			var parser = new DOMParser();
			onix = parser.parseFromString(onix_record_as_text, "text/xml");
		}
		
		catch (e) {
			alert('Error parsing onix record: ' + e);
			onix = null;
		}
		
		return onix;
	}
	
	
	// 3.2 Check for node
	
	function checkForNode(onix, path) {
		var result = onix.evaluate(path, onix, nsResolver, XPathResult.BOOLEAN_TYPE, null);
		return result.booleanValue;
	}
	
	function nsResolver(prefix) {
		switch (prefix) {
			case 'xml':
				return 'http://www.w3.org/XML/1998/namespace';
			default:
				return "http://ns.editeur.org/onix/3.0/reference";
		}
	}	
	
	// 3.3 Join array to comma list
	
	function joinArray(string_array) {
		var output_string = string_array.join(', ');
			output_string = output_string.replace(/, ([^,]+)$/, ', and $1');
			return output_string;
	}
	
	return {
		processOnixRecord: function(onixRecord) {
			return processOnixRecord(onixRecord);
		}
	}

})();

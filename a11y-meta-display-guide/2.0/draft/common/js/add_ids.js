
function addStringIDs() {
	
	var id_elements = document.querySelectorAll('code[id]');
	var code_array = [...id_elements];
	
	code_array.forEach(code => {
		var id_span = document.createElement('span');
			id_span.classList.add('str-id')
			id_span.appendChild(document.createTextNode('[ID: ' + code.id + ']'));
		code.insertAdjacentElement('beforeEnd', id_span);
	});
}

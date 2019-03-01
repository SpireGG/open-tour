/* eslint-env jquery, browser */
$(document).ready(() => {

  // Place JavaScript code here...

});

function previewFile() {
	const preview = document.getElementById('output');
	const file = document.querySelector('input[type=file]').files[0];
	const reader = new FileReader();

	reader.addEventListener('load', () => {
		preview.src = reader.result;
	}, false);

	if (file) {
		reader.readAsDataURL(file);
	}
}

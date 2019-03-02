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

function deleteTeam(uuid) {
  fetch(`/api/teams/${uuid}`, { method: 'delete' }).then(() => {
    window.location = '/';
  });
}
function deleteStream(uuid) {
	fetch(`/api/streams/${uuid}`, { method: 'delete' }).then(() => {
		window.location = '/';
	});

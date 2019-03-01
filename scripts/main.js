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

const twitch = require('../config/twitch');
Vue.component('stream', {
	props: [
		'id', 'title', 'name'
	],
	data: () => ({
		stream: null,
	}),
	template: '<div class="row mb-3" v-if="stream">' +
		'<div class="col-3">' +
		'<img :src="stream.channel.logo" class="img-fluid">' +
		'</div>' +
		'<div class="col-6">' +
		'<h4>{{name}}</h4>' +
		'<p class="card-subtitle text-muted">{{ stream.channel.status }}</p>' +
		'</div>' +
		'<div class="col-3">' +
		'<p>{{stream.viewers}} <i class="fas fa-eye"></i></p>' +
		'</div>' +
		'</div>',
	mounted() {
		twitch.getStream(this.id).then(stream => {this.stream = stream ? stream._data : null;});
	}
});

const app = new Vue({
	el: '#app',
});

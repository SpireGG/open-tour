const twitch = require('../config/twitch');
Vue.component('stream', {
	props: [
		'id', 'title', 'name', 'uuid'
	],
	data: () => ({
		stream: null,
	}),
	template: '<a :href="`/stream/${uuid}`" v-if="stream">' +
		'<div class="row mb-3">' +
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
		'</div>' +
		'</a>',
	mounted() {
		twitch.getStream(this.id).then(stream => {this.stream = stream ? stream._data : null;});
	}
});

const app = new Vue({
	el: '#app',
});

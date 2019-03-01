const mongoose = require('mongoose');
const Team = require('./Team');

const streamSchema = new mongoose.Schema({
	uuid: { type: String, unique: true },
	name: String,
	title: String,
	twitch_id: { type: String, unique: true },

	team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Team',
		require: false,
	},
}, { timestamps: true });

streamSchema.pre('save', (next) => {
	next();
});

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;

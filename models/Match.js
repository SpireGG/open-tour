const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
	uuid: { type: String, unique: true },

	team_blue: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Team',
		require: false,
	},
	team_red: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Team',
		require: false,
	},

	winner: { type: String },
	link: { type: String },

}, { timestamps: true });

matchSchema.pre('save', (next) => {
  next();
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;

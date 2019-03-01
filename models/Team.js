const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
	uuid: { type: String, unique: true },
  name: { type: String },
  logo: String,

	topName: { type: String },
	topOpgg: { type: String },
	jungleName: { type: String },
	jungleOpgg: { type: String },
	midName: { type: String },
	midOpgg: { type: String },
	adcName: { type: String },
	adcOpgg: { type: String },
	supportName: { type: String },
	supportOpgg: { type: String },

}, { timestamps: true });

teamSchema.pre('save', (next) => {
  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

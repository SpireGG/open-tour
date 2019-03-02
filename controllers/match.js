const Match = require('../models/Match');
const Team = require('../models/Team');
const uuid = require('uuid/v4');

/**
 * GET /matchs
 * Matchs page.
 */
exports.getMatchs = (req, res, next) => {
	Match.find({}).sort({ name: 1 }).populate('team').exec((err, matchs) => {
		if (err) return next(err);

		res.render('matchs/matchs', {
			title: 'Matchs',
			matchs,
		});
	});
};

/**
 * GET /matchs/:uuid
 * Match page.
 */
exports.getMatch = (req, res, next) => {
	const uuid = req.params.uuid;
	if (!uuid) res.redirect('index');

	Match.findOne({ uuid: uuid }, (err, match) => {
		if (err) return next(err);

		return res.render('matchs/match', {
			title: match.team_blue.name + ' vs ' + match.team_red.name,
			match,
		});
	}).populate('team_blue').populate('team_red');
};

/**
 * GET /matchs/new
 * Post match page.
 */
exports.postMatch = (req, res) => {
	Team.find({}).sort({ name: 1 }).exec((err, teams) => {
		if (err) return next(err);

		if (teams.length === 0) {
			req.flash('info', { msg: 'You must create a team first' });
			return res.redirect('/teams/new');
		}

		return res.render('matchs/post', {
			title: 'Add a match',
			teams,
		});
	});
};

/**
 * POST /api/matchs
 * Match create.
 */
exports.post = (req, res, next) => {
	req.assert('team_blue', 'Team blue cannot be blank').notEmpty();
	req.assert('team_red', 'Team red cannot be blank').notEmpty();

	const errors = req.validationErrors();
	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/matchs/new');
	}
	const match = new Match({
		uuid: uuid(),
		name: req.body.name,
		title: req.body.title,
		twitch_id: req.body.twitch_id,
	});

	const getTeamA = Team.findOne({ uuid: req.body.team_blue });
	const getTeamB = Team.findOne({ uuid: req.body.team_red });

	Promise.all([getTeamA, getTeamA]).then(result => {
		match.team_blue = result[0];
		match.team_red = result[1];

		const save = match.save();
		const updateA = Team.update({ uuid: req.body.team_blue }, { $push:  { matchs: match } });
		const updateB = Team.update({ uuid: req.body.team_red }, { $push:  { matchs: match } });

		Promise.all([save, updateA, updateB])
			.then((result) => {
				req.flash('success', { msg: `Match ${match.name} was successfully added.` });
				return res.redirect(`/matchs/${match.uuid}`);
			})
			.catch(err => next(err));
	});
};

/**
 * DELETE /api/matchs/:uuid
 * Match delete.
 */
exports.deleteMatch = (req, res, next) => {
	const uuid = req.params.uuid;
	if (!uuid) res.redirect('index');

	Match.remove({ uuid: uuid }, (err) => {
		if (err) return next(err);
		req.flash('errors', { msg: 'The match was successfully deleted.' });
		res.send(204);
	});
};

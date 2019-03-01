const Team = require('../models/Team');
const uuid = require('uuid/v4');
const _ = require('lodash');

/**
 * GET /teams
 * Teams page.
 */
exports.getTeams = (req, res, next) => {
	Team.find({}).sort({ name: 1 }).exec((err, teams) => {
		if (err) return next(err);

		res.render('teams/teams', {
			title: 'Equipes',
			teams,
		});
	});
};

/**
 * GET /teams/:uuid
 * Team page.
 */
exports.getTeam = (req, res, next) => {
	const uuid = req.params.uuid;
	if (!uuid) res.redirect('index');

	Team.findOne({ uuid: uuid }, (err, team) => {
		if (err) return next(err);

		return res.render('teams/team', {
			title: team.name,
			team,
			_,
		});
	});
};

/**
 * GET /teams/new
 * Post team page.
 */
exports.postTeam = (req, res) => {
	return res.render('teams/post', {
		title: 'Add a team',
	});
};

/**
 * POST /api/teams
 * Team create.
 */
exports.post = (req, res, next) => {
	req.assert('name', 'Name cannot be blank').notEmpty();

	const errors = req.validationErrors();
	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/teams/new');
	}

	const team = new Team({
		uuid: uuid(),
		name: req.body.name,
		logo: req.file ? req.file.filename : null,
		topName: req.body['top-name'],
		topOpgg: req.body['top-opgg'],
		jungleName: req.body['jungle-name'],
		jungleOpgg: req.body['jungle-opgg'],
		midName: req.body['mid-name'],
		midOpgg: req.body['mid-opgg'],
		adcName: req.body['adc-name'],
		adcOpgg: req.body['adc-opgg'],
		supportName: req.body['support-name'],
		supportOpgg: req.body['support-opgg'],
	});

	team.save((err, team) => {
		if (err) {
			if (err.code && err.code === 11000) {
				req.flash('errors', { msg: 'Team name already exists.' });
				return res.redirect('/teams/new');
			}

			return next(err);
		}

		return res.redirect(`/teams/${team.uuid}`);
	});
};

/**
 * DELETE /api/teams/:uuid
 * Team delete.
 */
exports.deleteTeam = (req, res, next) => {
	const uuid = req.params.uuid;
	if (!uuid) res.redirect('index');

	Team.remove({ uuid: uuid }, (err) => {
		if (err) return next(err);
		req.flash('errors', { msg: 'The team was successfully deleted.' });
		res.send(204);
	});
};

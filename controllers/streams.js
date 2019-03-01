const Stream = require('../models/Stream');
const Team = require('../models/Team');
const uuid = require('uuid/v4');
const twitch  = require('../config/twitch');

/**
 * GET /streams
 * Streams page.
 */
exports.getStreams = (req, res, next) => {
	Stream.find({}).sort({ name: 1 }).populate('team').exec((err, streams) => {
		if (err) return next(err);

		res.render('streams/streams', {
			title: 'Streams',
			streams,
		});
	});
};

/**
 * GET /streams/:uuid
 * Stream page.
 */
exports.getStream = (req, res, next) => {
	const uuid = req.params.uuid;
	if (!uuid) res.redirect('index');

	Stream.findOne({ uuid: uuid }, (err, stream) => {
		console.log(stream);
		if (err) return next(err);

		twitch.isStreamLive(stream.twitch_id).then((live) => {
			stream.live = live;
			return res.render('streams/stream', {
				title: stream.name,
				stream,
			});
		});
	}).populate('team');
};

/**
 * GET /streams/new
 * Post stream page.
 */
exports.postStream = (req, res) => {
	Team.find({}).sort({ name: 1 }).exec((err, teams) => {
		if (err) return next(err);

		if (teams.length === 0) {
			req.flash('info', { msg: 'You must create a team first' });
			return res.redirect('/teams/new');
		}

		return res.render('streams/post', {
			title: 'Add a stream',
			teams,
		});
	});
};

/**
 * POST /api/streams
 * Stream create.
 */
exports.post = (req, res, next) => {
	console.log(req.body);
	req.assert('name', 'Name cannot be blank').notEmpty();
	req.assert('twitch_id', 'Twitch id cannot be blank').notEmpty();
	req.assert('title', 'Title cannot be blank').notEmpty();

	const errors = req.validationErrors();
	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/streams/new');
	}
	const stream = new Stream({
		uuid: uuid(),
		name: req.body.name,
		title: req.body.title,
		twitch_id: req.body.twitch_id,
	});

	if (!req.body.team) {
		stream.save((err, stream) => {
			if (err) {
				if (err.code && err.code === 11000) {
					req.flash('errors', { msg: 'Stream id already exists.' });
					return res.redirect('/streams/new');
				}

				return next(err);
			}

			return res.redirect(`/streams/${stream.uuid}`);
		});
	} else {
		Team.findOne({ uuid: req.body.team }, (err, team) => {
			if (err) return next(err);
			stream.team = team;

			const save = stream.save();
			const update = Team.update({ uuid: req.body.team }, { $push:  { streams: stream } });
			Promise.all([save, update])
				.then((result) => {
					console.log(result);
					req.flash('success', { msg: `Stream ${stream.name} was successfully added.` });
					return res.redirect(`/streams/${result}`);
				})
				.catch(err => next(err));
		});
	}
};

/**
 * DELETE /api/streams/:uuid
 * Stream delete.
 */
exports.deleteStream = (req, res, next) => {
	const uuid = req.params.uuid;
	if (!uuid) res.redirect('index');

	Stream.remove({ uuid: uuid }, (err) => {
		if (err) return next(err);
		req.flash('errors', { msg: 'The stream was successfully deleted.' });
		res.send(204);
	});
};

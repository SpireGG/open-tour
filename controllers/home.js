const Stream = require('../models/Stream');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {

	Stream.find({}).sort({ name: 1 }).exec((err, streams) => {
		if (err) return next(err);

		res.render('home', {
			title: 'Home',
			streams,
		});
	});
};

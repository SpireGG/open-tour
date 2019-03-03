const Team = require('../models/Team');
const uuid = require('uuid/v4');
const _ = require('lodash');

/**
 * GET /stages/:stage
 * Team page.
 */
exports.getStage = (req, res, next) => {
	const stage = req.params.stage;
	if (!stage) res.redirect('index');

	return res.render('stages/stage' + stage, {
		title: 'Etape ' + stage,
	});
};

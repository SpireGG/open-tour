/**
 * GET /stages/:stage
 */
exports.getStage = (req, res, next) => {
	const stage = req.params.stage;
	if (!stage) res.redirect('index');

	return res.render('stages/stage' + stage, {
		title: 'Etape ' + stage,
	});
};

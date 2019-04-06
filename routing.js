module.exports = function (app) {
	const homeController = require('./controllers/home');
	app.get('/', homeController.index);

	const stageController = require('./controllers/stages');
	app.get('/etape-:stage', stageController.getStage);
};

module.exports = function (app) {
	const path = require('path');
  const passport = require('passport');
	const multer = require('multer');
	const passportConfig = require('./config/passport');

	const homeController = require('./controllers/home');
	const userController = require('./controllers/user');


	app.get('/', homeController.index);
	app.get('/login', userController.getLogin);
	app.post('/login', userController.postLogin);
	app.get('/logout', userController.logout);
	app.get('/forgot', userController.getForgot);
	app.post('/forgot', userController.postForgot);
	app.get('/reset/:token', userController.getReset);
	app.post('/reset/:token', userController.postReset);
	app.get('/signup', userController.getSignup);
	app.post('/signup', userController.postSignup);
	app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
	app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
	app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
	app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
	app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
		res.redirect(req.session.returnTo || '/');
	});


	/**
	 * Team routes
	 */
	const teamLogoStorage = multer.diskStorage({ destination: path.join(__dirname, 'uploads/teams'), filename(req, file, cb) { cb(null, file.originalname); } });
	const teamController = require('./controllers/team');

	app.get('/', teamController.getTeams);
	app.get('/teams', teamController.getTeams);
	app.get('/teams/new', teamController.postTeam);
	app.get('/teams/:uuid', teamController.getTeam);
	app.post('/api/teams', multer({ storage: teamLogoStorage }).single('logo'), teamController.post);
	app.delete('/api/teams/:uuid', teamController.deleteTeam);


	/**
	 * Stream routes
	 */
	const streamController = require('./controllers/streams');

	app.get('/', streamController.getStreams);
	app.get('/streams', streamController.getStreams);
	app.get('/streams/new', streamController.postStream);
	app.get('/streams/:uuid', streamController.getStream);
	app.post('/api/streams', streamController.post);
	app.delete('/api/streams/:uuid', streamController.deleteStream);
};

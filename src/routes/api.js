const Router = require('@koa/router');
const trackController = require('../controllers/track');
const statsController = require('../controllers/stats');

const router = new Router();

router.post('/track', trackController.trackEvent);
router.get('/stats/:autoId', statsController.getStats);

module.exports = router;
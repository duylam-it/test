const router = require('express').Router();
const { catchErrors } = require('../handlers/errorHandlers');
const roomController = require('../controllers/roomController');
const auth = require('../middlewares/auth');

router.post('/getAMsg', auth, catchErrors(roomController.read));
router.post('/addMsg', auth, catchErrors(roomController.addMessage));
router.post('/delete', auth, catchErrors(roomController.delete))
router.post('/create', auth, catchErrors(roomController.create))

module.exports = router;

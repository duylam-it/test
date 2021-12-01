const router = require('express').Router();
const { catchErrors } = require('../handlers/errorHandlers');
const otpController = require('../controllers/otpController');

router.post('/check', catchErrors(otpController.checkOTP));
router.post('/', catchErrors(otpController.sendOTP));

module.exports = router;

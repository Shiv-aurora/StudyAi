const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    logoutUser,
    guestLogin,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.post('/guest', guestLogin);

module.exports = router;

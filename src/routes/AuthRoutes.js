const express = require('express');
const { verifyTokenAccess } = require('../helpers/verifyToken');
const router = express.Router();

const { AuthControllers } = require('./../controllers');

const { Register, Login, Deactive, Activate, Closed } = AuthControllers;

router.post('/register', Register);
router.post('/login', Login);
router.patch('/deactive', verifyTokenAccess, Deactive);
router.patch('/activate', verifyTokenAccess, Activate);
router.patch('/closed', verifyTokenAccess, Closed);

module.exports = router;

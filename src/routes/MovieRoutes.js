const express = require('express');
const MovieControllers = require('../controllers/MovieControllers');
const { verifyTokenAccess } = require('../helpers/verifyToken');
const router = express.Router();

const { MovieAll, UpcommingMovie, EditStatusMovie, AddAdminMovie, AddScheduleMovie } = MovieControllers;

router.get('/get/all', MovieAll);
router.get('/get/', UpcommingMovie);
router.post('add', AddAdminMovie);
router.patch('/set/:id', verifyTokenAccess, EditStatusMovie);
router.patch('/edit/:id', verifyTokenAccess, AddScheduleMovie);

module.exports = router;

const express = require('express');
const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const writerRoute = require('./writerRoute');
const router = express.Router();

router.use('/', authRoute);
router.use('/user', userRoute);
router.use('/writer', writerRoute);

module.exports = router;

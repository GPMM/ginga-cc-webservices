var express = require('express');
var userController = require('../controllers/userapi');
var router = express.Router();

/* User API */
router.post('/user-list', userController.POSTUserList);
router.get('/users/:userid', userController.GETUserAttribute);
router.get('/current-user', userController.GETCurrentUser);
router.post('/current-user', userController.POSTCurrentUser);
router.get('/files', userController.GETUserFile);

module.exports = router;
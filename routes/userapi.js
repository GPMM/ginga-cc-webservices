var express = require('express');
var userController = require('../controllers/userapi');
var router = express.Router();

/* User API */
router.get('/user-list', userController.GETUserList);
router.get('/users/:userid', userController.GETUserAttribute);
router.get('/currentUser', userController.GETCurrentUser);
router.post('/currentUser', userController.POSTCurrentUser);
router.get('/files', userController.GETUserFile);

module.exports = router;
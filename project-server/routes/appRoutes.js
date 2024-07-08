const express = require('express');
const path = require('path');
const authenticateToken = require('../utils/auth');
const router = express.Router();
// Let The React App handle its routes.
//notice that the current path is to the project-web build folder and if Ill pass it to public i need to change path.
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});
//add auth to enter this route !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/videoadd', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});

router.get('/userpage/:userid', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});
router.get('/video/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});
router.get('/search/:query', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});
router.get('/video/:id/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..', 'project-web', 'build', 'index.html'));
});
module.exports = router;

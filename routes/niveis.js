/* 
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('niveis');
});

module.exports = router; */

const express = require("express");

const router = express.Router();

const db = require("../database/sqlite");

module.exports = router;
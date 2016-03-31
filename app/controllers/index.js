// app/controller/index.js
// CODING STANDARD - https://github.com/felixge/node-style-guide

// ============
// Dependencies
// ============
// Package Dependencies
var express = require('express');	// API route framework
var router	= express.Router();		// Router for Express

// ======
// Routes
// ======
// Main Routes
router.use('/', require('./main'));

// ELB Health Check
router.get('/health', function(req, res) {
	req.log.info({status: 200}, 'ELB Health Check');
	res.status(200).send();
});

// =======
// Exports
// =======
module.exports = router;
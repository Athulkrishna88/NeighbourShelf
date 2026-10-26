const express = require('express');
const router = express.Router();
const { getAllLocalities } = require('../controllers/localityController');

// Public route to get all localities for dropdown/filter
router.get('/', getAllLocalities);

module.exports = router;

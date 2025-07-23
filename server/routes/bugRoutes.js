const express = require('express');
const { getBugs, createBug } = require('../controllers/bugController');

const router = express.Router();

router.get('/', getBugs);
router.post('/', createBug);

module.exports = router;

const express = require('express');
const {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
} = require('../controllers/bugController');

const router = express.Router();

// GET /api/bugs/stats - Get bug statistics
router.get('/stats', getBugStats);

// GET /api/bugs - Get all bugs with optional filtering
router.get('/', getAllBugs);

// GET /api/bugs/:id - Get single bug
router.get('/:id', getBugById);

// POST /api/bugs - Create new bug
router.post('/api/bugs', createBug);

// PUT /api/bugs/:id - Update bug
router.put('/:id', updateBug);

// DELETE /api/bugs/:id - Delete bug
router.delete('/:id', deleteBug);

module.exports = router;
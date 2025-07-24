const Bug = require('../models/Bug');
const { validateBug, sanitizeInput, isValidObjectId } = require('../utils/validation');

// Get all bugs with optional filtering and pagination
const getAllBugs = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const bugs = await Bug.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Bug.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: bugs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBugs: total,
        hasNext: skip + bugs.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching bugs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bugs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single bug by ID
const getBugById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bug ID format'
      });
    }
    
    const bug = await Bug.findById(id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('Error fetching bug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new bug
const createBug = async (req, res) => {
  try {
    // Sanitize input data
    const sanitizedData = {
      title: sanitizeInput(req.body.title),
      description: sanitizeInput(req.body.description),
      status: req.body.status,
      priority: req.body.priority,
      assignee: sanitizeInput(req.body.assignee),
      reporter: sanitizeInput(req.body.reporter)
    };
    
    // Validate input
    const { error, value } = validateBug(sanitizedData);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    const bug = new Bug(value);
    const savedBug = await bug.save();
    
    res.status(201).json({
      success: true,
      message: 'Bug created successfully',
      data: savedBug
    });
  } catch (error) {
    console.error('Error creating bug:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create bug',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update bug
const updateBug = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bug ID format'
      });
    }
    
    // Sanitize input data
    const sanitizedData = {
      title: sanitizeInput(req.body.title),
      description: sanitizeInput(req.body.description),
      status: req.body.status,
      priority: req.body.priority,
      assignee: sanitizeInput(req.body.assignee),
      reporter: sanitizeInput(req.body.reporter)
    };
    
    // Validate input
    const { error, value } = validateBug(sanitizedData);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    const updatedBug = await Bug.findByIdAndUpdate(
      id,
      value,
      { new: true, runValidators: true }
    );
    
    if (!updatedBug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Bug updated successfully',
      data: updatedBug
    });
  } catch (error) {
    console.error('Error updating bug:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update bug',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete bug
const deleteBug = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bug ID format'
      });
    }
    
    const deletedBug = await Bug.findByIdAndDelete(id);
    
    if (!deletedBug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Bug deleted successfully',
      data: deletedBug
    });
  } catch (error) {
    console.error('Error deleting bug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bug',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get bug statistics
const getBugStats = async (req, res) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: null,
          totalBugs: { $sum: 1 },
          openBugs: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          inProgressBugs: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          resolvedBugs: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          criticalBugs: {
            $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] }
          },
          highPriorityBugs: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalBugs: 0,
      openBugs: 0,
      inProgressBugs: 0,
      resolvedBugs: 0,
      criticalBugs: 0,
      highPriorityBugs: 0
    };
    
    delete result._id;
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching bug statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
};
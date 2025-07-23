const Bug = require("../models/bugModel");

const createBug = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const bug = new Bug({ title, description, priority });
    const savedBug = await bug.save();

    res.status(201).json(savedBug);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBug };

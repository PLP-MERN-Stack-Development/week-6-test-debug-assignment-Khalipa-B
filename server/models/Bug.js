const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

module.exports = mongoose.model('Bug', bugSchema);

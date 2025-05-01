const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  parentType: { type: String, enum: ['Question', 'Answer'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'parentType' },
  content: { type: String, required: true, trim: true, minlength: 1 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema); 
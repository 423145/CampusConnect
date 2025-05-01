const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  parentType: { type: String, enum: ['Question', 'Answer'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'parentType' },
  reason: { type: String, required: true },
  description: { type: String, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema); 
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  title: { type: String }, // group title
  fingerprint: { type: String, index: true }, // key used to identify similar logs and group them together
  count: { type: Number, default: 1 }, // How many logs have been matched to this group so far
  lastSeen: { type: Date, default: Date.now }, // When was the last log added to this group
  sampleLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Log' } // Reference to a sample log in this group
}, { timestamps: true });

module.exports = mongoose.model('Group' , GroupSchema);
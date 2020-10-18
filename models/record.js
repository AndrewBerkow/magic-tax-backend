const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
  email: { type: String, required: true },
  m_status: { type: String, required: false },
  income: { type: Number, required: false },
  tax_paid: { type: Number, required: false},
  tax_return:  { type: Number, required: false},
});

module.exports = mongoose.model('Record', recordSchema);

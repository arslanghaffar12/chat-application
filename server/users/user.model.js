const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    image: { type: String },

}, { timestamps: { createdAt: 'created_at' } }
)

schema.set('toJSON', { virtual: true })
module.exports = mongoose.model('user', schema)
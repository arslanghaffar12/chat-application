const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    // content: { type: String, required: true },
    participants: [{ type: String, required: true, default: [] }],


})

schema.set("toJSON", { virtual: true }),
    module.exports = mongoose.model("conversation", schema)
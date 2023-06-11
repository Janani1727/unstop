
const mongoose = require("mongoose")

const seatSchema =  mongoose.Schema({
  seatNumber: { type: String, required: true },
  status: { type: String , default: true },
  id:{ type: Number }
});

const SeatModel = mongoose.model("train_seat", seatSchema)
module.exports = {
  SeatModel
}


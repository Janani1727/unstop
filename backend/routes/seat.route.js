const express = require("express");
const { SeatModel } = require("../model/seat.model");


const Seat_Route = express.Router();

//get all post from SeatModel
Seat_Route.get("/", async (req, res) => {
    try {
        const notes = await SeatModel.find();
        res.send(notes.reverse());
    } catch (error) {
        console.log(error)
    }

});





Seat_Route.post('/bookseat', async (req, res) => {
    const { bookseat } = req.body;
  
    let response = "";
  
    try {
      if (bookseat.length !== 0) {
        for (let i = 0; i < bookseat.length; i++) {
          const seats = await SeatModel.find({ id: bookseat[i] });
          for (let j = 0; j < seats.length; j++) {
            response += seats[j].seatNumber + " ";
          }
        }
      }
  
      const update = { $set: { status: false } };
  
      if (bookseat.length !== 0) {
        for (let i = 0; i < bookseat.length; i++) {
          await SeatModel.updateMany({ id: bookseat[i] }, update);
        }
      }
  
      res.status(200).json(`You have booked seats: ${response}`);
    } catch (error) {
      res.status(500).json({ error: 'failed.' });
    }
  });
  


Seat_Route.put("/removeseat", async (req, res) => {

    const {seatid} = req.body;

    const update = { $set: { status: "true"} };

 
    try {
        const user = await SeatModel.findByIdAndUpdate(seatid, update);
        res.status(200).json("Booking  cancelled");
    } catch (err) {
        return res.status(500).json(err);
    }

});








module.exports = {
    Seat_Route
};
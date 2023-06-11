const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");

require("dotenv").config();

const { Seat_Route } = require("./routes/seat.route");

let app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello!')
})

app.use("/seat", Seat_Route);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to the unstop");
  } catch (error) {
    console.log(error);
  }
  console.log(`server running on ${process.env.port} `);
});
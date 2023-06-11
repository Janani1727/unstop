import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";


import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

function App() {
  const [array, setarray] = useState([]);

  const [seat, setseat] = useState([]);

  const [seatcounts, setseatcounts] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const finalRef = React.useRef(null);

  const toast = useToast();

  const [status, setstatus] = useState();

  let bookedSeats = [];

  const bookSeats = (seatcount) => {
    seatcount = parseInt(seatcount);
    for (let i = 0; i <= 80 - seatcount; i++) {
      let seatsPerRow = i < 77 ? 7 : 3;
      if (
        (i % seatsPerRow) + seatcount <= seatsPerRow &&
        status.slice(i, i + seatcount).every((seat) => seat === "true")
      ) {
        for (let j = 0; j < seatcount; j++) {
          const seatIndex = i + j;
          bookedSeats.push(seatIndex + 1);
          array.push(seatIndex);
        }
        const updatedSeats = [...status];
        for (let j = i; j < i + seatcount; j++) {
          updatedSeats[j] = "false";
        }
        break;
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let res = await axios(
        `https://encouraging-pig-turtleneck-shirt.cyclic.app/seat`
      );

      setseat(res.data);

      let data = res.data;

      let arr = [];

      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].status);
      }

      setstatus(arr);
    } catch (error) {
      console.log(error);
    }
  };

  const book_seats = async () => {
    try {
      let data = {
        bookseat: array,
      };
      let res = await axios.post(
        `https://encouraging-pig-turtleneck-shirt.cyclic.app/seat/bookseat`,
        data
      );
      toast({
        title: `booking successful  ${res.data}`,

        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      setarray([]);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookSeat = () => {
    bookSeats(seatcounts);
    book_seats();
  };

  const undoBooking = async () => {
    let seat_id = localStorage.getItem("seatid");
    let index = localStorage.getItem("index");
    const id = {
      seatid: seat_id,
    };

    try {
      const res = await axios.put(
        `https://encouraging-pig-turtleneck-shirt.cyclic.app/seat/removeseat`,
        id
      );
      // console.log(res.data)

      onClose();
      localStorage.removeItem("seatid");

      toast({
        title: "Booking cancelled",

        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      fetchData(); //check
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="main"
      style={{
        textAlign: "center",
      }}
    >
      <h2>
        {" "}
        <b> Seat Booking</b>{" "}
      </h2>

      <div className="input">
        <div
          style={{
            display: "flex",
            // margin: "auto",
            width: "70%",
            // height:"10px",
            // border: "1px solid red",
            marginLeft: "300px",
          }}
        >
          <div>
            <FormLabel fontSize={"22px"}>Enter the no. of Seats</FormLabel>
          </div>
          <div>
            <Input
              id="seatCount"
              min="1"
              max="7"
              defaultValue="1"
              onChange={(e) => setseatcounts(e.target.value)}
              w={400}
              border="3px solid black"
              fontSize={"22px"}
              borderColor="gray.800"
            />
          </div>

          <div>
            <p className="seatstext">No. of seats to be booked {seatcounts}</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleBookSeat}
        size="md"
        backgroundColor={"rgb(59, 228, 59)"}
        height={"50px"}
        width={"150px"}
        mt={5}
        fontSize={"20px"}
        mb={5}
      >
        Book Ticket
      </Button>

      <div id="coach" className="coach">
        {seat.map((seat, index) => (
          <div
            key={index}
            className={`seat ${seat.status}`}
            onClick={() => {
              if (seat.status === "false") {
                localStorage.setItem("seatid", seat._id);
                localStorage.setItem("index", seat.id);
                onOpen();
              }
            }}
          >
            <p className="name">{seat.seatNumber}</p>
          </div>
        ))}
      </div>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> To cancel booking press YES</ModalHeader>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="blue" onClick={undoBooking}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;

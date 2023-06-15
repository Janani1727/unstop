import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {MdOutlineChair} from "react-icons/md"

import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
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
  const [loading, setLoading] = useState(false);

  let bookedSeats = [];

  const bookSeats = (seatcount) => {
    seatcount = parseInt(seatcount);
    for (let i = 0; i <= 80 - seatcount; i++) {
      let seatsPerRow = i < 77 ? 7 : 3;
      // let seatsPerRow = i < 80
      if (
        (i % seatsPerRow) + seatcount <= seatsPerRow &&
        status.slice(i, i + seatcount).every((seat) => seat === "true")
      ) {
        console.log(seatsPerRow, "seats per row");
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
      } else {
        console.log(seatsPerRow);
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
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleBookSeat = () => {
    if (seatcounts > 7) {
      toast({
        title: "passenger can only book upto 7 seats",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      bookSeats(seatcounts);
      book_seats();
    }
    // bookSeats(seatcounts);
    // book_seats();
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

  const undoAllBooking = async () => {
    // let seat_id = localStorage.getItem("seatid");
    // let index = localStorage.getItem("index");
    // const id = {
    //   seatid: seat_id,
    // };

    try {
      const res = await axios.put(
        `https://encouraging-pig-turtleneck-shirt.cyclic.app/seat/removeall`
      );
      // console.log(res.data)

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
    <>
      <Box
        position={"absolute"}
        w={"full"}
        h={"115vh"}
        backgroundImage={
          "url(https://images.unsplash.com/uploads/1413387158190559d80f7/6108b580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)"
        }
        backgroundSize={"cover"}
        backgroundPosition={"center center"}
      ></Box>
      <Box p={5} textAlign={"center"}>
        <Heading>Seat Booking</Heading>
      </Box>

      <Flex
        // border={"1px solid red"}
        // alignItems={"center"}

        justifyContent={"space-evenly"}
        gap={10}
      >
        <Box
         position={"relative"}
          bg={"whiteAlpha.600"}
          boxShadow="rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
          p={20}
          h="81vh"
          borderRadius={10}
        >
          <Box>
            <FormLabel fontSize={"22px"}>Enter the no. of Seats</FormLabel>
          </Box>
          <Box>
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
          </Box>

          <Box>
            <Text color={"black"}>
              No. of seats to be booked {seatcounts}
            </Text>
          </Box>

          <Flex mt={10} alignItems={"center"} justifyContent={"space-evenly"}>
            <Box>
              <Button colorScheme="red" onClick={undoAllBooking}>
                delete all bookings
              </Button>
            </Box>
            <Box>
              <Button
                onClick={handleBookSeat}
                // size="md"
                backgroundColor={"rgb(59, 228, 59)"}
                // fontSize={"20px"}
                isLoading={loading}
                loadingText="Loading..."
              >
                Book Ticket
              </Button>
            </Box>
          </Flex>

          {/* <---------Animations---------> */}

          <div className="swing">
            <Text>
              you can cancel booking by clicking on the particular seat number
            </Text>
          </div>
        </Box>

        <Box>
          <Box
          mt={"-90px"}
            bg={"whiteAlpha.600"}
            pl={1}
            position={"relative"}
            // border={"1px solid blue"}
            textAlign={"center"}
            w={"500px"}
            display={"flex"}
            // border={"1px solid red"}
            flexWrap={"wrap"}
            borderRadius={10}
            p={1}
            boxShadow="rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
          >
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
                 <p className="chair"><MdOutlineChair/></p>
                <p className="name">{seat.seatNumber}</p>
              </div>
            ))}
          </Box>
        </Box>
      </Flex>

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
    </>
  );
}

export default App;

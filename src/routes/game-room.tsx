import { useParams } from "react-router-dom"
import styled from "styled-components";
import { database } from "../firebase";
import { child, get, onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import DropdownForm from "../components/dropDownForm";
import CompareOneForm from "../components/compareOneNumber";
import CompareTwoForm from "../components/compareTwoNumber";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const FormWrapper = styled.div`
  width: 400px;
  border: 1px solid black;
  padding: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 위아래 간격 */
`;

const HintWrapper = styled.div`
  border: 1px solid black;
  margin-left: 10px;
`;

const Table = styled.table`
  width: 500px;
  border: 1px solid black;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border: 1px solid black;
`;

const TableCell = styled.td`
  border: 1px solid black;
`;

const Title = styled.h1``;

const H1 = styled.p``;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
`;

const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: 1px solid black;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;


export default function GameRoom() {
  const { room_id } = useParams();
  const [hostPlayer, setHostPlayer] = useState("");
  const [guestPlayer, setGuestPlayer] = useState("");
  const [currentTurn, setCurrentTurn] = useState("");

  //get current room information
  // useEffect(() => {
  //     const dbRef = ref(database);
  //     get(child(dbRef, `rooms/${room_id}`)).then((snapshot) => {
  //         if (snapshot.exists()) {
  //             const roomData = snapshot.val();
  //             console.log(roomData);
  //             setHostPlayer(roomData.host);
  //             setGuestPlayer(roomData.guest);
  //             setCurrentTurn(roomData.turn);
  //         } else {
  //             console.log("No data available");
  //         }
  //     }).catch((error) => {
  //         console.log(error);
  //     });
  // }, [room_id]);

  //turn change
  // const changeTurn = () => {
  //     const nextTurn = currentTurn === hostPlayer ? guestPlayer : hostPlayer;
  //     update(ref(database, `rooms/${room_id}`), {
  //         turn: nextTurn,
  //     }).then(() => {
  //         setCurrentTurn(nextTurn);
  //     }).catch((error) => {
  //         console.log("Error updating turn:", error);
  //     });
  // };

  // useEffect(() => {
  //     const turnRef = ref(database, `rooms/${room_id}/turn`);
  //     onValue(turnRef, (snapshot) => {
  //         const data = snapshot.val();
  //         console.log(data);
  //         setCurrentTurn(data);
  //     });
  // }, [room_id]);

  //start game
  //set name and turn
  //set opponent number to local

  //set secret number

  //compare one
  //update game status chart

  //compare two
  //update game status chart

  //guessing number
  //if correct, end the game
  //if not, show corresponding message and change turn

  //wait for end game call
  //end game => delete room

  const onButtonClick = () => {
    console.log("hi")
  }
  return (
    <Wrapper>
      {/* <Title>Game Room : {room_id}</Title>
            <H1>Host : </H1>
            <H1>Guest : </H1>
            <H1>Current Turn : {currentTurn}</H1> */}

      {/* <Button onClick={changeTurn}>Change Turn</Button> */}

      <FormWrapper>
        <DropdownForm buttonText="Submit Number" onButtonClick={onButtonClick} />
        <CompareOneForm buttonText="Compare" onButtonClick={onButtonClick} />
        <CompareTwoForm buttonText="Compare" onButtonClick={onButtonClick} />
        <DropdownForm buttonText="Guess Enemy Number" onButtonClick={onButtonClick} />
      </FormWrapper>

      <HintWrapper>
        <Table>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Compared</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>X+Y</TableCell>
            <TableCell>X = Y</TableCell>
          </TableRow>
        </Table>
      </HintWrapper>

      {/* game status chart */}
    </Wrapper>
  )
}
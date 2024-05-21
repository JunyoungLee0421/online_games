import { useParams } from "react-router-dom"
import styled from "styled-components";
import { auth, database } from "../firebase";
import { child, get, onValue, ref, set, update } from "firebase/database";
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
  const [hasSubmit, setHasSubmit] = useState(false);

  const [selfSecretNum, setSelfSecretNum] = useState([]);
  const [enemySecretNum, setEnemySecretNum] = useState([]);

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

  //wait until guest join, once just join, get the initial data
  useEffect(() => {
    const guestRef = ref(database, `rooms/${room_id}/guest`);
    onValue(guestRef, (snapshot) => {
      console.log("guest has entered!");
      //set host and guest name
      const dbRef = ref(database);
      get(child(dbRef, `rooms/${room_id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          console.log(roomData);
          setHostPlayer(roomData.host.name);
          setGuestPlayer(roomData.guest.name);
          setCurrentTurn(roomData.turn);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.log(error);
      });
    });
  }, [room_id]);


  //on submit number, set the number to te db
  //check if there is no duplicate and all the numbers add up to 20.
  //pass it if it is, alert user and return early otherwise.
  const submitSecretNumber = async (selectedNumbers: number[]) => {
    try {
      const playerName = auth.currentUser?.displayName;
      const dbRef = ref(database, 'rooms/' + room_id + "/" + playerName);
      await set(dbRef, {
        secretNumber: selectedNumbers
      }).then(() => {
        console.log('submitted secret number successfully');
      }).catch((error) => {
        console.log(error);
      });
      setHasSubmit(true);
    } catch (e) {
      console.log(e);
    }
  }

  //set opponent number to local(?)
  //if i store the secret numbers on local, when compare just have to push the result to db
  //otherwise i will have to get both secret numbers everything.
  //so when i submit mine, i store it to local. 
  //wait for opponent to submit, use onValue to save it into my local

  //compare one
  //update game status chart
  const compareOne = async () => {

  }

  //compare two
  //update game status chart
  const compareTwo = async () => {

  }

  //guessing number
  //if correct, show winning message and end the game. 
  //if not, show corresponding message and change turn
  //on end game, once player clicks the alert redirect them to the home page (for now)
  const guessNumber = async () => {

  }

  //wait for end game call
  //end game => delete room

  const onButtonClick = () => {
    console.log("hi")
  }
  return (
    <Wrapper>
      <Title>Game Room : {room_id}</Title>
      {hostPlayer && guestPlayer ? (
        <>
          <H1>Host : {hostPlayer}</H1>
          <H1>Guest : {guestPlayer}</H1>
        </>
      ) : (
        <H1>Waiting for players to join...</H1>
      )}

      {/* <H1>Current Turn : {currentTurn}</H1> */}

      {/* <Button onClick={changeTurn}>Change Turn</Button> */}

      <FormWrapper>
        <DropdownForm hasSubmit={hasSubmit} buttonText="Submit Number" onButtonClick={submitSecretNumber} />
        <CompareOneForm buttonText="Compare" onButtonClick={onButtonClick} />
        <CompareTwoForm buttonText="Compare" onButtonClick={onButtonClick} />
        <DropdownForm hasSubmit={false} buttonText="Guess Enemy Number" onButtonClick={onButtonClick} />
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
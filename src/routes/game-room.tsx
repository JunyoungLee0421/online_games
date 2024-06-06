import { useParams } from "react-router-dom"
import styled from "styled-components";
import { auth, database } from "../firebase";
import { child, get, onValue, push, ref, set, update } from "firebase/database";
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
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [currentTurn, setCurrentTurn] = useState("");
  const [hasSubmit, setHasSubmit] = useState(false);

  const [selfSecretNum, setSelfSecretNum] = useState<number[]>([]);
  const [enemySecretNum, setEnemySecretNum] = useState<number[]>([]);

  const [hints, setHints] = useState<{ compared: string, result: string }[]>([]);

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
          setPlayerA(roomData.playerA.name);
          setPlayerB(roomData.playerB.name);
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
      setSelfSecretNum(selectedNumbers);
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
  useEffect(() => {
    const playerName = auth.currentUser?.displayName;
    let enemyName = "";
    if (playerName === playerA) {
      enemyName = playerB;
    } else if (playerName === playerB) {
      enemyName = playerA;
    }

    const enemyRef = ref(database, `rooms/${room_id}/${enemyName}/secretNumber`);
    onValue(enemyRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("enemy has submitted secret number!");
        console.log(snapshot.val());
        setEnemySecretNum(snapshot.val());
        console.log(enemySecretNum);
      } else {
        console.log("No data available");
      }
    });
  }, [room_id, playerA, playerB]);

  //compare one
  //update game status chart
  //compared : tim's B / sabu's B
  //result : tim's B > sabu's B 
  const compareOne = async (myNum: string, enemyNum: string) => {
    const myIndex = "ABCD".indexOf(myNum);
    const enemyIndex = "ABCD".indexOf(enemyNum);

    if (myIndex !== -1 && enemyIndex !== -1) {
      const myValue = selfSecretNum[myIndex];
      const enemyValue = enemySecretNum[enemyIndex];
      const result = myValue > enemyValue ? ">" : myValue < enemyValue ? "<" : "=";

      const hint = {
        compared: `${myNum} vs ${enemyNum}`,
        result: `${myNum} ${result} ${enemyNum}`
      };

      const dbRef = ref(database, 'rooms/' + room_id + "/hints");
      await push(dbRef, hint);
      console.log('Hint added:', hint);
    } else {
      console.log("Invalid indices for comparison.");
    }
  }

  //compare two
  //update game status chart
  //compared : tim's A + B : sabu's C + D
  //result : tim's A + B = sabu's C + D
  const compareTwo = async (myNums: string[], enemyNums: string[]) => {
    const myIndices = myNums.map(num => "ABCD".indexOf(num));
    const enemyIndices = enemyNums.map(num => "ABCD".indexOf(num));

    if (myIndices.every(idx => idx !== -1) && enemyIndices.every(idx => idx !== -1)) {
      const myValue = myIndices.reduce((acc, idx) => acc + selfSecretNum[idx], 0);
      const enemyValue = enemyIndices.reduce((acc, idx) => acc + enemySecretNum[idx], 0);
      const result = myValue > enemyValue ? ">" : myValue < enemyValue ? "<" : "=";

      const hint = {
        compared: `${myNums.join(' + ')} vs ${enemyNums.join(' + ')}`,
        result: `${myNums.join(' + ')} ${result} ${enemyNums.join(' + ')}`
      };

      const dbRef = ref(database, 'rooms/' + room_id + "/hints");
      await push(dbRef, hint);
      console.log('Hint added:', hint);
    } else {
      console.log("Invalid indices for comparison.");
    }
  }

  // fetch hints and update UI
  useEffect(() => {
    const hintsRef = ref(database, `rooms/${room_id}/hints`);
    onValue(hintsRef, (snapshot) => {
      const hintsData = snapshot.val();
      if (hintsData) {
        const hintsArray = Object.values(hintsData) as { compared: string; result: string }[];
        setHints(hintsArray);
      }
    });
  }, [room_id]);


  //guessing number
  //if correct, show winning message and end the game. 
  //if not, show corresponding message and change turn
  //on end game, once player clicks the alert redirect them to the home page (for now)
  const guessNumber = async (selectedNumbers: number[]) => {

  }

  //wait for end game call
  //end game => delete room

  const onButtonClick = () => {
    console.log("hi")
  }
  return (
    <Wrapper>
      <Title>Game Room : {room_id}</Title>
      {playerA && playerB ? (
        <>
          <H1>Player A : {playerA}</H1>
          <H1>Player B : {playerB}</H1>
        </>
      ) : (
        <H1>Waiting for another player to join...</H1>
      )}

      {/* <H1>Current Turn : {currentTurn}</H1> */}

      {/* <Button onClick={changeTurn}>Change Turn</Button> */}

      <FormWrapper>
        <DropdownForm hasSubmit={hasSubmit} buttonText="Submit Number" onButtonClick={submitSecretNumber} />
        <CompareOneForm buttonText="Compare" onButtonClick={compareOne} />
        <CompareTwoForm buttonText="Compare" onButtonClick={compareTwo} />
        <DropdownForm hasSubmit={false} buttonText="Guess Enemy Number" onButtonClick={guessNumber} />
      </FormWrapper>

      {/* game status chart */}
      <HintWrapper>
        <Table>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Compared</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
          {hints.map((hint, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{hint.compared}</TableCell>
              <TableCell>{hint.result}</TableCell>
            </TableRow>
          ))}
        </Table>
      </HintWrapper>
    </Wrapper>
  )
}
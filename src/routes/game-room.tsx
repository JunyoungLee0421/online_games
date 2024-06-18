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
  flex-direction: column;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const GamePlayWrapper = styled.div`
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

export default function GameRoom() {
  const { room_id } = useParams();
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [currentTurn, setCurrentTurn] = useState("");
  const [hasSubmit, setHasSubmit] = useState(false);

  const [selfSecretNum, setSelfSecretNum] = useState<number[]>([]);
  const [enemySecretNum, setEnemySecretNum] = useState<number[]>([]);

  const [hints, setHints] = useState<{ playerA: string; inequality: string; playerB: string }[]>([]);

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

  //set opponent number to local
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
  const compareOne = async (playerANum: string, playerBNum: string) => {
    const playerAIndex = "ABCD".indexOf(playerANum);
    const playerBIndex = "ABCD".indexOf(playerBNum);
    const playerName = auth.currentUser?.displayName;

    if (playerAIndex !== -1 && playerBIndex !== -1) {
      let myValue, enemyValue, hint;

      if (playerName === playerA) {
        // 내가 playerA이면
        myValue = selfSecretNum[playerAIndex];
        enemyValue = enemySecretNum[playerBIndex];
      } else {
        // 내가 playerB이면
        myValue = selfSecretNum[playerBIndex];
        enemyValue = enemySecretNum[playerAIndex];
      }

      // 항상 playerA의 숫자가 왼쪽에 오도록 비교
      const result = playerName === playerA
        ? myValue > enemyValue ? ">" : myValue < enemyValue ? "<" : "="
        : enemyValue > myValue ? ">" : enemyValue < myValue ? "<" : "=";

      hint = {
        playerA: playerANum,
        inequality: result,
        playerB: playerBNum
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
  const compareTwo = async (playerANums: string[], playerBNums: string[]) => {
    const playerAIndices = playerANums.map(num => "ABCD".indexOf(num));
    const playerBIndices = playerBNums.map(num => "ABCD".indexOf(num));
    const playerName = auth.currentUser?.displayName;

    if (playerAIndices.every(idx => idx !== -1) && playerBIndices.every(idx => idx !== -1)) {
      let playerAValue, playerBValue, hint;

      if (playerName === playerA) {
        // 내가 playerA이면
        playerAValue = playerAIndices.reduce((acc, idx) => acc + selfSecretNum[idx], 0);
        playerBValue = playerBIndices.reduce((acc, idx) => acc + enemySecretNum[idx], 0);
      } else {
        // 내가 playerB이면
        playerAValue = playerAIndices.reduce((acc, idx) => acc + enemySecretNum[idx], 0);
        playerBValue = playerBIndices.reduce((acc, idx) => acc + selfSecretNum[idx], 0);
      }

      // 항상 playerA의 숫자가 왼쪽에 오도록 비교
      const result = playerAValue > playerBValue ? ">" : playerAValue < playerBValue ? "<" : "=";

      hint = {
        playerA: playerANums.join(' + '),
        inequality: result,
        playerB: playerBNums.join(' + ')
      };

      const dbRef = ref(database, `rooms/${room_id}/hints`);
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
        const hintsArray = Object.values(hintsData) as { playerA: string; inequality: string; playerB: string }[];
        setHints(hintsArray);
      }
    });
  }, [room_id]);


  //guessing number
  //if correct, show winning message and end the game. 
  //if not, show corresponding message and change turn
  //on end game, once player clicks the alert redirect them to the home page (for now)
  const guessNumber = async (selectedNumbers: number[]) => {
    const playerName = auth.currentUser?.displayName;
    if (JSON.stringify(selectedNumbers) === JSON.stringify(enemySecretNum)) {
      const dbRef = ref(database, `rooms/${room_id}`);
      await update(dbRef, {
        isGameFinished: true,
        winner: playerName
      });
      console.log('Game finished successfully');
    } else {
      console.log('Wrong guess. Try again.');
    }
  }

  //wait for end game call
  useEffect(() => {
    const gameFinishedRef = ref(database, `rooms/${room_id}/isGameFinished`);
    onValue(gameFinishedRef, (snapshot) => {
      if (snapshot.val()) {
        const dbRef = ref(database, `rooms/${room_id}/winner`);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const winner = snapshot.val();
            alert(`${winner} won the game!`);
            // Redirect to homepage
          }
        });
      }
    });
  }, [room_id]);

  //end game => delete room

  return (

    <Wrapper>
      <InfoWrapper>
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
      </InfoWrapper>
      <GamePlayWrapper>
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
              <TableCell>playerA</TableCell>
              <TableCell>inequality</TableCell>
              <TableCell>playerB</TableCell>
            </TableRow>
            {hints.map((hint, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{hint.playerA}</TableCell>
                <TableCell>{hint.inequality}</TableCell>
                <TableCell>{hint.playerB}</TableCell>
              </TableRow>
            ))}
          </Table>
        </HintWrapper>
      </GamePlayWrapper>



    </Wrapper>
  )
}
import { useNavigate, useParams } from "react-router-dom";
import { FormWrapper, GamePlayWrapper, H1, InfoWrapper, Wrapper } from "../../components/game-room-components";
import BaseballDropDown from "../../components/baseball-components/baseball-drop-down-form";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { child, get, onValue, push, ref, remove, set, update } from "firebase/database";
import { auth, database } from "../../firebase";

const HintWrapper = styled.div`
  width: 350px;
  border: 1px solid black;
  margin-left: 10px;
  border-radius: 10px; /* 모서리 둥글게 */
  background-color: #f9f9f9; /* 배경색 추가 */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate; /* 테두리 분리 */
  text-align: center; /* 텍스트 왼쪽 정렬 */
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2; /* 줄무늬 배경색 */
  }
`;

const TableHeader = styled.th`
  border: 2px solid #ddd;
  margin-bottom: 10px; /* 헤더 사이 간격 */
  margin-left: 20px;
  padding: 12px 15px; /* 패딩 추가 */
  background-color: #779ee8;
  color: white;
  &:first-child {
    border-top-left-radius: 10px; /* 좌상단 모서리 둥글게 */
  }

  &:last-child {
    border-top-right-radius: 10px; /* 우상단 모서리 둥글게 */
  }
`;

const TableHeaderTwo = styled.th`
  border: 2px solid #ddd;
  margin-bottom: 10px; /* 헤더 사이 간격 */
  margin-left: 20px;
  padding: 12px 15px; /* 패딩 추가 */
  background-color: #e89977;
  color: white;
  &:first-child {
    border-top-left-radius: 10px; /* 좌상단 모서리 둥글게 */
  }

  &:last-child {
    border-top-right-radius: 10px; /* 우상단 모서리 둥글게 */
  }
`;

const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 12px 15px; /* 패딩 추가 */
  margin-bottom: 10px; /* 셀 사이 간격 */
`;

type HintType = {
    guess: number[];
    hint: string;
};

export default function BaseBallGame() {
    const navigate = useNavigate();
    const { room_id } = useParams();
    const [playerA, setPlayerA] = useState("");
    const [playerB, setPlayerB] = useState("");
    const [currentTurn, setCurrentTurn] = useState("");
    const [hasSubmit, setHasSubmit] = useState(false);
    // const [selfSecretNum, setSelfSecretNum] = useState<number[]>([]);
    const [enemySecretNum, setEnemySecretNum] = useState<number[]>([]);
    const [selfHint, setSelfHint] = useState<HintType[]>([]);
    const [enemyHint, setEnemyHint] = useState<HintType[]>([]);

    /**
     * wait till guest join & getting initial data
     */
    useEffect(() => {
        const guestRef = ref(database, `rooms/${room_id}/playerB`);
        onValue(guestRef, () => {
            //set host and guest name
            const dbRef = ref(database);
            get(child(dbRef, `rooms/${room_id}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const roomData = snapshot.val();
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

    /**
     * submit number, set the number to db
     * number should not start with 0
     * no duplicates
     */
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
            //setSelfSecretNum(selectedNumbers);
            setHasSubmit(true);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * set opponent number to local when its submitted to db
     */
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
                setEnemySecretNum(snapshot.val());
            } else {
                console.log("No data available");
            }
        });
    }, [room_id, playerA, playerB]);

    /**
     * guess number
     */
    const guessNumber = async (selectedNumbers: number[]) => {
        const playerName = auth.currentUser?.displayName;

        // calculate hint
        let strike = 0;
        let ball = 0;
        selectedNumbers.forEach((num, idx) => {
            if (num === enemySecretNum[idx]) {
                strike++;
            } else if (enemySecretNum.includes(num)) {
                ball++;
            }
        });
        const hint = `${strike}S ${ball}B`;

        // upload hint to db
        const dbRef = ref(database, `rooms/${room_id}/hints/${playerName}`);
        await push(dbRef, {
            guess: selectedNumbers,
            hint: hint,
        });

        // when guess was correct
        if (strike === 3) {
            // upload db info
            const dbRef = ref(database, `rooms/${room_id}`);
            await update(dbRef, {
                isGameFinished: true,
                winner: playerName,
            });
            console.log('Game finished successfully');
        } else {
            //change turn
            changeTurn();
        }
    };

    /**
     * fetch hints and update UI
     */
    useEffect(() => {
        const playerName = auth.currentUser?.displayName;
        if (!playerName) return;

        const hintsRef = ref(database, `rooms/${room_id}/hints`);
        onValue(hintsRef, (snapshot) => {
            const allHints = snapshot.val();
            if (allHints) {
                const selfHintArray: HintType[] = [];
                const enemyHintArray: HintType[] = [];

                Object.entries(allHints).forEach(([key, hintData]) => {
                    if (key === playerName) {
                        const hints = Object.values(hintData as { [key: string]: HintType }) as HintType[];
                        selfHintArray.push(...hints);
                    } else {
                        const hints = Object.values(hintData as { [key: string]: HintType }) as HintType[];
                        enemyHintArray.push(...hints);
                    }
                });

                setSelfHint(selfHintArray);
                setEnemyHint(enemyHintArray);
            }
        });
    }, [room_id]);

    /**
     * wait for end game call
     */
    useEffect(() => {
        const gameFinishedRef = ref(database, `rooms/${room_id}/isGameFinished`);
        const unsubscribe = onValue(gameFinishedRef, (snapshot) => {
            if (snapshot.val()) {
                const dbRef = ref(database, `rooms/${room_id}/winner`);
                get(dbRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const winner = snapshot.val();
                        const roomRef = ref(database, `rooms/${room_id}`);

                        //alert user
                        alert(`${winner} won the game!`);
                        //delete room
                        remove(roomRef);
                        // Redirect to homepage
                        navigate("/");

                        // Unsubscribe the listener to prevent infinite loop
                        unsubscribe();
                    }
                });
            }
        });
        // Cleanup function to unsubscribe the listener
        return () => unsubscribe();
    }, [room_id]);

    /**
     * turn change
     */
    const changeTurn = () => {
        const nextTurn = currentTurn === playerA ? playerB : playerA;
        update(ref(database, `rooms/${room_id}`), {
            turn: nextTurn,
        }).then(() => {
            setCurrentTurn(nextTurn);
        }).catch((error) => {
            console.log("Error updating turn:", error);
        });
    };

    useEffect(() => {
        const turnRef = ref(database, `rooms/${room_id}/turn`);
        onValue(turnRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            setCurrentTurn(data);
        });
    }, [room_id]);

    const isMyTurn = auth.currentUser?.displayName === currentTurn;

    return (
        <Wrapper>
            <InfoWrapper>
                <H1>Game Room : {room_id}</H1>
                <H1>Type : Baseball Game</H1>
                {playerA && playerB ? (
                    <>
                        <H1>Player A : {playerA}</H1>
                        <H1>Player B : {playerB}</H1>
                    </>
                ) : (
                    <H1>Waiting for another player to join...</H1>
                )}
                <H1>Current Turn : {currentTurn}</H1>

            </InfoWrapper>
            <GamePlayWrapper>
                <FormWrapper>
                    <BaseballDropDown isClickable={hasSubmit} buttonText="Submit Number" onButtonClick={submitSecretNumber} />
                    <BaseballDropDown isClickable={!isMyTurn} buttonText="Guess Number" onButtonClick={guessNumber} />
                </FormWrapper>

                {/* game status chart */}
                <HintWrapper>
                    <Table>
                        <thead>
                            <TableRow>
                                <TableHeader>Index</TableHeader>
                                <TableHeader>Guess</TableHeader>
                                <TableHeader>Hint</TableHeader>
                            </TableRow>
                        </thead>
                        <tbody>
                            {selfHint.map((hint, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{hint.guess}</TableCell>
                                    <TableCell>{hint.hint}</TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </HintWrapper>
                <HintWrapper>
                    <Table>
                        <thead>
                            <TableRow>
                                <TableHeaderTwo>Index</TableHeaderTwo>
                                <TableHeaderTwo>Guess</TableHeaderTwo>
                                <TableHeaderTwo>Hint</TableHeaderTwo>
                            </TableRow>
                        </thead>
                        <tbody>
                            {enemyHint.map((hint, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{hint.guess}</TableCell>
                                    <TableCell>{hint.hint}</TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </HintWrapper>
            </GamePlayWrapper>
        </Wrapper>
    )
}
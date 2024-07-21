import { useNavigate, useParams } from "react-router-dom";
import { FormWrapper, GamePlayWrapper, H1, InfoWrapper, Wrapper } from "../../components/game-room-components";
import BaseballDropDown from "../../components/baseball-components/baseball-drop-down-form";
import styled from "styled-components";
import { useState } from "react";

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

export default function BaseBallGame() {
    const navigate = useNavigate();
    const { room_id } = useParams();
    const [playerA, setPlayerA] = useState("");
    const [playerB, setPlayerB] = useState("");
    const [currentTurn, setCurrentTurn] = useState("");
    const [hasSubmit, setHasSubmit] = useState(false);
    const [selfSecretNum, setSelfSecretNum] = useState<number[]>([]);
    const [enemySecretNum, setEnemySecretNum] = useState<number[]>([]);

    /**
     * wait till guest join & getting initial data
     */

    /**
     * submit number, set the number to db
     * number should not start with 0
     * no duplicates
     */

    /**
     * set opponent number to local when its submitted to db
     */

    /**
     * guess number
     */

    /**
     * fetch hints and update UI
     */

    /**
     * wait for end game call
     */

    /**
     * turn change
     */

    return (
        <Wrapper>
            <InfoWrapper>
                <H1>Game Room : {room_id}</H1>
                <H1>Type : Baseball Game</H1>
                {/* {playerA && playerB ? (
                    <>
                        <H1>Player A : {playerA}</H1>
                        <H1>Player B : {playerB}</H1>
                    </>
                ) : (
                    <H1>Waiting for another player to join...</H1>
                )}
                <H1>Current Turn : {currentTurn}</H1> */}

            </InfoWrapper>
            <GamePlayWrapper>
                <FormWrapper>
                    <BaseballDropDown isClickable={false} buttonText="Submit Number" onButtonClick={() => (console.log("hi"))} />
                    <BaseballDropDown isClickable={false} buttonText="Guess Number" onButtonClick={() => (console.log("hi"))} />
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
                            {/* {hints.map((hint, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{hint.playerA}</TableCell>
                                    <TableCell>{hint.inequality}</TableCell>
                                    <TableCell>{hint.playerB}</TableCell>
                                </TableRow>
                            ))} */}
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
                            {/* {hints.map((hint, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{hint.playerA}</TableCell>
                                    <TableCell>{hint.inequality}</TableCell>
                                    <TableCell>{hint.playerB}</TableCell>
                                </TableRow>
                            ))} */}
                        </tbody>
                    </Table>
                </HintWrapper>
            </GamePlayWrapper>
        </Wrapper>
    )
}
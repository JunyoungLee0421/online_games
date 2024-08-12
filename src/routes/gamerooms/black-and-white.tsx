import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Wrapper, InfoWrapper, H1 } from "../../components/game-room-components";
import DnDContext from "../../components/black-and-white-components/DnDContext";
import Card from "../../components/black-and-white-components/Card";
import DropZone from "../../components/black-and-white-components/DropZone";
import styled from 'styled-components';
import { auth, database } from "../../firebase";
import { child, get, onValue, ref } from "firebase/database";

const GamePlayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const DroppedCardContainer = styled.div`
    position: absolute;
    top: -80px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    pointer-events: none;
`;

const DroppedCard = styled.div<{ id: number }>`
    display: inline-block;
    width: 60px;
    height: 90px;
    margin: 0 5px;
    background-color: ${props => (props.id % 2 === 0 ? 'black' : 'white')};
    color: ${props => (props.id % 2 === 0 ? 'white' : 'black')};
    border: 1px solid black;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const LockInButton = styled.button`
    width: 100px;
    margin: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #1d9bf0;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #1b8edb;
    }

    /* 버튼 비활성화 스타일 */
    ${(props) =>
        props.disabled &&
        `
        opacity: 0.5;
        cursor: not-allowed;
    `}
`;

const BlackAndWhiteGame: React.FC = () => {
    const navigate = useNavigate();
    const { room_id } = useParams();

    const [playerA, setPlayerA] = useState("");
    const [playerB, setPlayerB] = useState("");
    const [currentTurn, setCurrentTurn] = useState("");

    const [droppedCards, setDroppedCards] = useState<{ id: number, text: string }[]>([]);
    const [cards, setCards] = useState([
        { id: 0, text: '0' },
        { id: 1, text: '1' },
        { id: 2, text: '2' },
        { id: 3, text: '3' },
        { id: 4, text: '4' },
        { id: 5, text: '5' },
        { id: 6, text: '6' },
        { id: 7, text: '7' },
        { id: 8, text: '8' },
    ]);

    /**
     * handle drop card
     * @param id number of the card
     */
    const handleDrop = (id: number) => {
        const droppedCard = cards.find((card) => card.id === id);
        if (droppedCard) {
            setDroppedCards([...droppedCards, droppedCard]);
            setCards(cards.filter((card) => card.id !== id));
        }
    };

    /**
     * 선 플레이어가 숫자를 정함 -> db에 올림
     * 후 플레이어쪽에서 onValue로 감지 -> 해당 숫자 저장, 화면에 색깔 표시
     * 후 플레이어가 숫자를 정함 -> 후공 컴퓨터에서 숫자 비교 후 결과 db에 전달 (누가 이겼는지, 다음 턴이 누군지)
     * 각각 결과쪽에 onValue로 감지 -> 업데이트되면 스코어 업데이트 후 다음 라운드 진행
     * 한쪽 스코어가 5점이 되면 자동으로 게임 끝
     */

    /**
     * when submit
     */
    const onSubmit = () => {
        if (droppedCards.length > 0) {
            const droppedCardIds = droppedCards.map(card => card.id);
            console.log("Dropped Cards:", droppedCardIds);

            // droppedCards에 있는 카드들의 id와 일치하지 않는 cards를 필터링
            const updatedCards = cards.filter(
                card => !droppedCardIds.includes(card.id)
            );
            setCards(updatedCards);

            // droppedCards 초기화
            setDroppedCards([]);
        } else {
            console.log("No cards dropped");
        }
    };


    /**
     * detect opponent card submission
     */

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
     * fetch result and update score table
     */

    /**
     * wait for end game call
     */

    /**
     * turn change
     */

    const isMyTurn = auth.currentUser?.displayName === currentTurn;

    return (
        <Wrapper>
            <InfoWrapper>
                <H1>Game Room : {room_id}</H1>
                <H1>Type : Black and White</H1>
            </InfoWrapper>
            <DnDContext>
                <GamePlayWrapper>
                    <DropZone onDrop={handleDrop} />
                    {droppedCards.length > 0 && (
                        <DroppedCardContainer>
                            {droppedCards.map((card) => (
                                <DroppedCard key={card.id} id={card.id}>{card.text}</DroppedCard>
                            ))}
                        </DroppedCardContainer>
                    )}
                    <LockInButton onClick={onSubmit} disabled={false}>Submit</LockInButton>
                    <CardContainer>
                        {cards.map((card) => (
                            <Card key={card.id} id={card.id} text={card.text} />
                        ))}
                    </CardContainer>
                </GamePlayWrapper>
            </DnDContext>
        </Wrapper>
    );
}

export default BlackAndWhiteGame;

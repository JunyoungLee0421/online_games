import { useParams } from "react-router-dom";
import React, { useState } from 'react';
import { Wrapper, GamePlayWrapper, InfoWrapper, H1 } from "../../components/game-room-components";
import DnDContext from "../../components/black-and-white-components/DnDContext";
import Card from "../../components/black-and-white-components/Card";
import DropZone from "../../components/black-and-white-components/DropZone";
import styled from 'styled-components';

const CardContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const DroppedCardList = styled.div`
    margin-top: 20px;
    text-align: center;
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
`;

const LockInButton = styled.button`
    margin-top: 10px;
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
`;

const BlackAndWhiteGame: React.FC = () => {
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

    const [droppedCards, setDroppedCards] = useState<{ id: number, text: string }[]>([]);

    const handleDrop = (id: number) => {
        const droppedCard = cards.find((card) => card.id === id);
        if (droppedCard) {
            setDroppedCards([...droppedCards, droppedCard]);
            setCards(cards.filter((card) => card.id !== id));
        }
    };

    return (
        <DnDContext>
            <Wrapper>
                <InfoWrapper>
                    <H1>Game Room</H1>
                    <H1>Type : Baseball Game</H1>
                </InfoWrapper>
                <GamePlayWrapper>
                    <CardContainer>
                        {cards.map((card) => (
                            <Card key={card.id} id={card.id} text={card.text} />
                        ))}
                    </CardContainer>
                    <DropZone onDrop={handleDrop} />
                    <LockInButton>Lock In</LockInButton>
                    <DroppedCardList>
                        <h3>Dropped Cards</h3>
                        {droppedCards.map((card) => (
                            <DroppedCard key={card.id} id={card.id}>{card.text}</DroppedCard>
                        ))}
                    </DroppedCardList>
                </GamePlayWrapper>
            </Wrapper>
        </DnDContext>
    );
}

export default BlackAndWhiteGame;
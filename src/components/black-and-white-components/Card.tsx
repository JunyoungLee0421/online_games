import { useDrag } from 'react-dnd';
import styled from 'styled-components';

interface CardProps {
    id: number;
    text: string;
}

const CardContainer = styled.div<{ isDragging: boolean; id: number }>`
    width: 60px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
    background-color: ${props => (props.id % 2 === 0 ? 'black' : 'white')};
    color: ${props => (props.id % 2 === 0 ? 'white' : 'black')};
    border: 1px solid black;
    cursor: move;
    font-size: 24px;
    opacity: ${props => (props.isDragging ? 0.5 : 1)};
`;

const Card: React.FC<CardProps> = ({ id, text }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CARD',
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <CardContainer ref={drag} isDragging={isDragging} id={id}>
            {text}
        </CardContainer>
    );
};

export default Card;

import { useDrop } from 'react-dnd';
import styled from 'styled-components';

interface DropZoneProps {
    onDrop: (id: number) => void;
}

const DropZoneContainer = styled.div<{ isOver: boolean }>`
    width: 70px;
    height: 100px;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed ${props => (props.isOver ? 'black' : 'gray')};
    background-color: ${props => (props.isOver ? '#e0e0e0' : '#f9f9f9')};
    transition: background-color 0.3s ease;
`;

const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item: { id: number }) => onDrop(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <DropZoneContainer ref={drop} isOver={isOver}>
            {isOver ? 'Release to drop' : 'Drop Card'}
        </DropZoneContainer>
    );
};

export default DropZone;

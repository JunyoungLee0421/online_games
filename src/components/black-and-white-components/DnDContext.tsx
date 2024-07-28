import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ReactNode } from 'react';

interface DnDContextProps {
    children: ReactNode;
}

const DnDContext: React.FC<DnDContextProps> = ({ children }) => {
    return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};

export default DnDContext;

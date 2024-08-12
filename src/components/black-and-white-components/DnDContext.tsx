import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { ReactNode } from 'react';

interface DnDContextProps {
    children: ReactNode;
}

const DnDContext: React.FC<DnDContextProps> = ({ children }) => {
    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            {children}
        </DndProvider>
    );
};

export default DnDContext;

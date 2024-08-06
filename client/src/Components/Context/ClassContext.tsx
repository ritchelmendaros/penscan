import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Class } from '../Interface/Class';

// Define the context type
interface ClickedClassContextType {
    clickedClass: Class | undefined; // Allow for undefined as initial state
    setClass: (clickedClass: Class) => void;
}

// Define the provider props type
interface ClickedClassProviderProps {
    children: ReactNode;
}

// Create the context with a default value of undefined
const ClickedClassContext = createContext<ClickedClassContextType | undefined>(
    undefined,
);

// Custom hook to use the ClickedClassContext
const useClass = () => {
    const context = useContext(ClickedClassContext);
    if (context === undefined) {
        throw new Error('useClass must be used within a ClickedClassProvider');
    }
    return context;
};

// Create the provider component
const ClickedClassProvider: React.FC<ClickedClassProviderProps> = ({
    children,
}) => {
    const [selectedClass, setSelectedClass] = useState<Class | undefined>(
        undefined,
    );

    return (
        <ClickedClassContext.Provider
            value={{ clickedClass: selectedClass, setClass: setSelectedClass }}
        >
            {children}
        </ClickedClassContext.Provider>
    );
};

export { ClickedClassProvider, useClass };

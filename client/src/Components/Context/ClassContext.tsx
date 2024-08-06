import React, { createContext, useContext, ReactNode, useState } from 'react';
import { ClassInterface } from '../Interface/ClassInterface';

// Define the context type
interface ClickedClassContextType {
    classList: ClassInterface[];
    clickedClass: ClassInterface | undefined; // Allow for undefined as initial state
    setClass: (clickedClass: ClassInterface) => void;
    setClassList: (newClassList: ClassInterface[]) => void; // Function to replace classList with a new array
    addNewClass: (newClass: ClassInterface) => void; // Function to add a single class to the list
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
    const [selectedClass, setSelectedClass] = useState<
        ClassInterface | undefined
    >(undefined);
    const [classList, setClassList] = useState<ClassInterface[]>([]); // Initialize with an empty array

    // Function to add a single new class to the existing classList
    const addNewClass = (newClass: ClassInterface) => {
        setClassList((prevClassList) => [newClass, ...prevClassList]);
    };

    return (
        <ClickedClassContext.Provider
            value={{
                classList,
                clickedClass: selectedClass,
                setClass: setSelectedClass,
                setClassList, // Set the entire classList
                addNewClass, // Function to add a single class to the list
            }}
        >
            {children}
        </ClickedClassContext.Provider>
    );
};

export { ClickedClassProvider, useClass };

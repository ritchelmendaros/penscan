import React, { createContext, useContext, ReactNode, useState } from 'react';
import { StudentImageResult } from '../Interface/Quiz';

interface StudentImageResultContextType {
    selectedStudentImageResult: StudentImageResult | undefined;
    setSelectedStudentImageResult: (studentImageResult: StudentImageResult) => void;
}

interface StudentImageResultProviderProps {
    children: ReactNode;
}

const StudentImageResultContext = createContext<StudentImageResultContextType | undefined>(undefined);

const useStudentImageResult = () => {
    const context = useContext(StudentImageResultContext);
    if (context === undefined) {
        throw new Error('useStudentImageResult must be used within a StudentImageResultProvider');
    }
    return context;
};

const StudentImageResultProvider: React.FC<StudentImageResultProviderProps> = ({ children }) => {
    const [selectedStudentImageResult, setSelectedStudentImageResult] = useState<StudentImageResult | undefined>(undefined);

    return (
        <StudentImageResultContext.Provider
            value={{
                selectedStudentImageResult,
                setSelectedStudentImageResult,
            }}
        >
            {children}
        </StudentImageResultContext.Provider>
    );
};

export { StudentImageResultProvider, useStudentImageResult };

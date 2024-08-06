import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Quiz, StudentQuiz } from '../Interface/Quiz';

interface QuizContextType {
    selectedStudentResult: StudentQuiz | undefined;
    selectedQuiz: Quiz | undefined;
    setSelectedQuiz: (quiz: Quiz) => void;
    setSelectedStudentResult: (selectedStudent: StudentQuiz) => void;
}

interface QuizProviderProps {
    children: ReactNode;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const useQuiz = () => {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};

const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>(
        undefined,
    );
    const [selectedStudentResult, setSelectedStudentResult] = useState<
        StudentQuiz | undefined
    >(undefined);

    return (
        <QuizContext.Provider
            value={{
                selectedStudentResult,
                selectedQuiz,
                setSelectedQuiz,
                setSelectedStudentResult,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};

export { QuizProvider, useQuiz };

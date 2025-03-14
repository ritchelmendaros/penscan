interface Quiz {
    quizid: string;
    classid: string;
    quizname: string;
    teacherid: string;
    // quizanswerkey: string;
    quizanswerkey: { itemnumber: number; answer: string }[];
    dueDateTime: string;
    totalitems: number;
}
//Student Quiz
interface Quizzes {
    quizId: string;
    quizName: string;
    dueDateTime: string;
    dueDateTimeRaw: string;
    totalitems: number;
}

interface StudentQuiz {
    firstName: string;
    lastName: string;
    score: number;
    finalScore: number;
    userId: string;
    username: string;
    editedStatus: string;
    dueDateTime: string;
    lastModified: string;
}

interface StudentImageResult {
    studentquizid: string;
    quizid: string;
    studentid: string;
    score: number;
    quizimage: {
        type: number;
        data: string;
    };
    // recognizedtext: string;
    recognizedAnswers?: RecognizedAnswer[]; 
    comment?: string | null;
    base64Image: string;
    editedanswer?: string | null;
    editedstatus?: string | null;
    bonusscore: number;
    finalscore: number;
}

interface RecognizedAnswer {
    itemnumber: number;
    answer: string;
    correct: boolean;
}

interface ItemAnalysisInterface {
    correctCount: number;
    incorrectCount: number;
    itemNumber: number;
    difficultyIndex: number;
    difficultyInterpretation: string;
    discriminationIndex: number;
    discriminationInterpretation: string;
    suggestedDecision: string;
    itemanalysisid: string;
    quizid: string;
}

export type { Quiz, Quizzes ,StudentQuiz, StudentImageResult, ItemAnalysisInterface };

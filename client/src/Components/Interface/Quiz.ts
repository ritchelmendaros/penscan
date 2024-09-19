interface Quiz {
    quizid: string;
    classid: string;
    quizname: string;
    teacherid: string;
    quizanswerkey: string;
}
//Student Quiz
interface Quizzes {
    quizId: string;
    quizName: string;
}

interface StudentQuiz {
    firstName: string;
    lastName: string;
    score: number;
    finalScore: number;
    userId: string;
    username: string;
    editedStatus: string;
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
    recognizedtext: string;
    comment?: string | null;
    base64Image: string;
    editedanswer?: string | null;
    editedstatus?: string | null;
    bonusscore: number;
    finalscore: number;
}

interface ItemAnalysisInterface {
    correctCount: number;
    incorrectCount: number;
    itemNumber: number;
    itemanalysisid: string;
    quizid: string;
}

export type { Quiz, Quizzes ,StudentQuiz, StudentImageResult, ItemAnalysisInterface };

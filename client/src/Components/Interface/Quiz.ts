interface Quiz {
    quizid: string;
    classid: string;
    quizname: string;
    teacherid: string;
    quizanswerkey: string;
}

interface StudentQuiz {
    firstName: string;
    lastName: string;
    score: number;
    userId: string;
    username: string;
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
    base64Image: string;
}

export type { Quiz, StudentQuiz, StudentImageResult };

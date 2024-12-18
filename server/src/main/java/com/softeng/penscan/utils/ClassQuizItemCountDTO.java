package com.softeng.penscan.utils;

import java.util.List;

public class ClassQuizItemCountDTO {
    private String className;
    private List<QuizItemCountDTO> quizzes;

    public ClassQuizItemCountDTO(String className, List<QuizItemCountDTO> quizzes) {
        this.className = className;
        this.quizzes = quizzes;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public List<QuizItemCountDTO> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<QuizItemCountDTO> quizzes) {
        this.quizzes = quizzes;
    }

}

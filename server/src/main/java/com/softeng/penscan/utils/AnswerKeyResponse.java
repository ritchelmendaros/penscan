package com.softeng.penscan.utils;

import com.softeng.penscan.model.Quiz.AnswerKeyItem;
import java.time.LocalDateTime;
import java.util.List;

public class AnswerKeyResponse {
    private List<AnswerKeyItem> quizanswerkey;
    private LocalDateTime dueDateTime;

    // Constructor
    public AnswerKeyResponse(List<AnswerKeyItem> quizanswerkey, LocalDateTime dueDateTime) {
        this.quizanswerkey = quizanswerkey;
        this.dueDateTime = dueDateTime;
    }

    // Getters and Setters
    public List<AnswerKeyItem> getQuizanswerkey() {
        return quizanswerkey;
    }

    public void setQuizanswerkey(List<AnswerKeyItem> quizanswerkey) {
        this.quizanswerkey = quizanswerkey;
    }

    public LocalDateTime getDueDateTime() {
        return dueDateTime;
    }

    public void setDueDateTime(LocalDateTime dueDateTime) {
        this.dueDateTime = dueDateTime;
    }
}

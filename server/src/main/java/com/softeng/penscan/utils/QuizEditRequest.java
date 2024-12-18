package com.softeng.penscan.utils;

import com.softeng.penscan.model.Quiz;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

import java.util.List;

@Getter
@Setter
public class QuizEditRequest {
    private String quizId;
    private String quizName;
    private LocalDateTime dueDateTime;
    private List<Quiz.AnswerKeyItem> answerKeys;
}

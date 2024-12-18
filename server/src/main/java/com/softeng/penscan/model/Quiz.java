package com.softeng.penscan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "Quiz")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Quiz {

    @Id
    private String quizid;
    private String classid;
    private String quizname;
    private String teacherid;
    private List<AnswerKeyItem> quizanswerkey;
    private LocalDateTime dueDateTime;
    private int totalitems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerKeyItem {
        private int itemnumber;
        private String answer;
    }
}

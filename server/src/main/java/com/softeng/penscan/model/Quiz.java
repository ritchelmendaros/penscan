package com.softeng.penscan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String quizanswerkey;
}

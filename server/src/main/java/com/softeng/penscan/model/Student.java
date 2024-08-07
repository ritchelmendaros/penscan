package com.softeng.penscan.model;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Student")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Student {

    @Id
    private String studentid;
    private String userid;
    private List<String> classid = new ArrayList<>();
    private List<String> quizid = new ArrayList<>();
}

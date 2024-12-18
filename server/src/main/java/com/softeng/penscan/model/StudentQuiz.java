package com.softeng.penscan.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.bson.types.Binary;
import java.util.Map;
import lombok.NoArgsConstructor;

@Document(collection = "StudentQuiz")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentQuiz {

    @Id
    private String studentquizid;
    private String quizid;
    private String studentid;
    private int score;
    private Binary quizimage;
    private List<RecognizedAnswer> recognizedAnswers;
    private String base64Image;
    private String comment;
    private int bonusscore;
    private List<EditedAnswer> editedanswer;
    private EditedStatus editedstatus;
    private ScoreStatus scorestatus;
    private int finalscore;
    private List<String> activityLogIds = new ArrayList<>();

    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }

    public void setScore(int score) {
        this.score = score;
        updateFinalScore();
    }

    public void setBonusscore(int bonusscore) {
        this.bonusscore = bonusscore;
        updateFinalScore();
    }

    private void updateFinalScore() {
        this.finalscore = this.score + this.bonusscore;
    }

    public void setRecognizedAnswers(List<RecognizedAnswer> recognizedAnswers) {
        this.recognizedAnswers = recognizedAnswers;
    }

    public void setEditedanswer(List<EditedAnswer> editedanswer) {
        this.editedanswer = editedanswer;
    }

    private Map<Integer, Boolean> itemAnalysis = new HashMap<>();

    public void incrementScore() {
        this.score++;
        updateFinalScore();
    }

    public void decrementScore() {
        this.score--;
        updateFinalScore();
    }

    public void updateItemAnalysis(int itemId, boolean isCorrect) {
        this.itemAnalysis.put(itemId, isCorrect);
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class RecognizedAnswer {
        private int itemnumber;
        private String answer;
        private boolean isCorrect;

        public void setCorrect(boolean isCorrect) {
            this.isCorrect = isCorrect;
        }

    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class EditedAnswer {
        private int itemnumber;
        private String editeditem;
        private boolean isapproved;
        private boolean isdisapproved;
        private boolean isedited;
        private List<String> feedback = new ArrayList<>();
        private String editedby;

        public void approve() {
            this.isapproved = true;
            this.isdisapproved = false;
        }

        public void disapprove() {
            this.isapproved = false;
            this.isdisapproved = true;
        }

        public void setEditedItem(String editeditem) {
            this.editeditem = editeditem;
        }

        public void markAsEdited() {
            this.isedited = true;
        }
    }

    public enum EditedStatus {
        NONE, PENDING, APPROVED, REJECTED
    }

    public enum ScoreStatus {
        NONE, PENDING, APPROVED, REJECTED
    }
}

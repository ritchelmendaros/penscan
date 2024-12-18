package com.softeng.penscan.utils;

public class EditStudentQuizRequest {
    private String studentQuizId;
    private String userId;
    private String newText;
    private String comment;
    private String editedAnswer;
    private int bonusScore;
    private String editedStatus;

    // Getters and Setters
    public String getStudentQuizId() {
        return studentQuizId;
    }

    public void setStudentQuizId(String studentQuizId) {
        this.studentQuizId = studentQuizId;
    }

    public String getNewText() {
        return newText;
    }

    public void setNewText(String newText) {
        this.newText = newText;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEditedAnswer() {
        return editedAnswer;
    }

    public void setEditedAnswer(String editedAnswer) {
        this.editedAnswer = editedAnswer;
    }

    public int getBonusScore() {
        return bonusScore;
    }

    public void setBonusScore(int bonusScore) {
        this.bonusScore = bonusScore;
    }

    public String getEditedStatus() {
        return editedStatus;
    }

    public void setEditedStatus(String editedStatus) {
        this.editedStatus = editedStatus;
    }

    @Override
    public String toString() {
        return "EditStudentQuizRequest{" +
                "studentQuizId='" + studentQuizId + '\'' +
                ", newText='" + newText + '\'' +
                ", comment='" + comment + '\'' +
                ", editedAnswer='" + editedAnswer + '\'' +
                ", bonusScore=" + bonusScore +
                ", editedStatus='" + editedStatus + '\'' +
                '}';
    }

}

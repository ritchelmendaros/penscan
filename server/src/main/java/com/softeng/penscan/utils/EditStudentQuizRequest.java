package com.softeng.penscan.utils;

public class EditStudentQuizRequest {
    private String studentQuizId;
    private String newText;

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
}

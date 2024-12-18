package com.softeng.penscan.utils;

public class QuizItemCountDTO {
    private String quizName;
    private int totalItems;
    private int highScorersCount;
    private int lowScorersCount;

    public QuizItemCountDTO(String quizName, int totalItems, int highScorersCount, int lowScorersCount) {
        this.quizName = quizName;
        this.totalItems = totalItems;
        this.highScorersCount = highScorersCount;
        this.lowScorersCount = lowScorersCount;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public int getHighScorersCount() {
        return highScorersCount;
    }

    public void setHighScorersCount(int highScorersCount) {
        this.highScorersCount = highScorersCount;
    }

    public int getLowScorersCount() {
        return lowScorersCount;
    }

    public void setLowScorersCount(int lowScorersCount) {
        this.lowScorersCount = lowScorersCount;
    }
}

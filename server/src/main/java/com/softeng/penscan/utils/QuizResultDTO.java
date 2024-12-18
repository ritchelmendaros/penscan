package com.softeng.penscan.utils;

import java.util.List;

public class QuizResultDTO {

    private String quizName;
    private int totalItems;
    private List<StudentScoreDTO> scores;
    private int passCount;
    private int failCount;
    private int nearPerfectCount;

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

    public List<StudentScoreDTO> getScores() {
        return scores;
    }

    public void setScores(List<StudentScoreDTO> scores) {
        this.scores = scores;
    }

    public int getPassCount() {
        return passCount;
    }

    public void setPassCount(int passCount) {
        this.passCount = passCount;
    }

    public int getFailCount() {
        return failCount;
    }

    public void setFailCount(int failCount) {
        this.failCount = failCount;
    }

    public int getNearPerfectCount() {
        return nearPerfectCount;
    }

    public void setNearPerfectCount(int nearPerfectCount) {
        this.nearPerfectCount = nearPerfectCount;
    }

    // Nested DTO for Student Scores
    public static class StudentScoreDTO {

        private String studentName;
        private int score;
        private double percentage;

        // Getters and Setters
        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }
    }
}

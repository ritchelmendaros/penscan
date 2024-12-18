package com.softeng.penscan.utils;

public class ClassStudentCountDTO {
    private String className;
    private int studentCount;

    public ClassStudentCountDTO(String className, int studentCount) {
        this.className = className;
        this.studentCount = studentCount;
    }

    public String getClassName() {
        return className;
    }

    public int getStudentCount() {
        return studentCount;
    }
}
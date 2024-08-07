package com.softeng.penscan.utils;

import com.softeng.penscan.model.Student;
import com.softeng.penscan.model.Class;

public class StudentClassResponse {
    private Student student;
    private Class updatedClass;

    public StudentClassResponse(Student student, Class updatedClass) {
        this.student = student;
        this.updatedClass = updatedClass;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Class getUpdatedClass() {
        return updatedClass;
    }

    public void setUpdatedClass(Class updatedClass) {
        this.updatedClass = updatedClass;
    }
}

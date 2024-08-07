package com.softeng.penscan.service;

import com.softeng.penscan.model.Class;
import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.model.Student;
import com.softeng.penscan.repository.ClassRepository;
import com.softeng.penscan.repository.QuizRepository;
import com.softeng.penscan.repository.StudentRepository;
import com.softeng.penscan.utils.StudentClassResponse;

import jakarta.persistence.EntityNotFoundException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private QuizRepository quizRepository;

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public StudentClassResponse addClassToStudentAndClass(String userid, String classid) {
        Optional<Student> optionalStudent = studentRepository.findByUserid(userid);
        if (!optionalStudent.isPresent()) {
            String errorMessage = "User with ID " + userid + " not found.";
            throw new IllegalArgumentException(errorMessage);
        }

        Optional<Class> optionalClass = classRepository.findById(classid);
        if (!optionalClass.isPresent()) {
            String errorMessage = "Class with ID " + classid + " not found.";
            throw new IllegalArgumentException(errorMessage);
        }

        Student student = optionalStudent.get();
        Class classEntity = optionalClass.get();

        if (student.getClassid() == null) {
            student.setClassid(new ArrayList<>());
        }
        if (!student.getClassid().contains(classid)) {
            student.getClassid().add(classid);
        }

        if (classEntity.getStudentid() == null) {
            classEntity.setStudentid(new ArrayList<>());
        }
        if (!classEntity.getStudentid().contains(userid)) {
            classEntity.getStudentid().add(userid);
        }

        studentRepository.save(student);
        classRepository.save(classEntity);

        return new StudentClassResponse(student, classEntity);
    }

    public Class getClassDetails(String classId) {
        return classRepository.findById(classId).orElse(null);
    }

    public List<String> getClassIdsByUserId(String userid) {
        Optional<Student> studentOptional = studentRepository.findByUserid(userid);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            return student.getClassid();
        } else {
            throw new EntityNotFoundException("Student not found with userid: " + userid);
        }
    }

    public List<Student> getStudentsByClassId(String classId) {
        return studentRepository.findByClassid(classId);
    }

    public List<String> getQuizIdsByUserIdAndClassId(String userId, String classId) {
        Optional<Student> studentOptional = studentRepository.findByUserid(userId);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            List<String> quizIds = student.getQuizid();
            List<String> matchingQuizIds = new ArrayList<>();
            for (String quizId : quizIds) {
                Optional<Quiz> quizOptional = quizRepository.findById(quizId);
                if (quizOptional.isPresent()) {
                    Quiz quiz = quizOptional.get();
                    if (quiz.getClassid().equals(classId)) {
                        matchingQuizIds.add(quizId);
                    }
                }
            }
            return matchingQuizIds;
        } else {
            return Collections.emptyList();
        }
    }

    public String getQuizNameById(String quizId) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        return quizOptional.map(Quiz::getQuizname).orElse(null);
    }

}

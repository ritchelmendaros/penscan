package com.softeng.penscan.service;

import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.repository.QuizRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public Quiz addQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizzesByTeacherIdAndClassId(String teacherId, String classId) {
        return quizRepository.findByTeacheridAndClassid(teacherId, classId);
    }

    public Quiz getQuizById(String quizId) {
        return quizRepository.findById(quizId).orElse(null);
    }
}

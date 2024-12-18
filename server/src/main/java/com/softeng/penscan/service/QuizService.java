package com.softeng.penscan.service;

import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.model.Quiz.AnswerKeyItem;
import com.softeng.penscan.repository.QuizRepository;

import java.util.List;

import com.softeng.penscan.utils.QuizEditRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public Quiz addQuiz(Quiz quiz) {
        List<AnswerKeyItem> answerKeyItems = quiz.getQuizanswerkey();
        if (answerKeyItems != null && !answerKeyItems.isEmpty()) {
            for (AnswerKeyItem answerKeyItem : answerKeyItems) {
                if (answerKeyItem.getItemnumber() <= 0) {
                    throw new IllegalArgumentException("Invalid item number: " + answerKeyItem.getItemnumber());
                }
                if (answerKeyItem.getAnswer() == null || answerKeyItem.getAnswer().isEmpty()) {
                    throw new IllegalArgumentException("Answer cannot be null or empty: " + answerKeyItem);
                }
            }
        } else {
            throw new IllegalArgumentException("Answer key must not be empty");
        }
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizzesByTeacherIdAndClassId(String teacherId, String classId) {
        return quizRepository.findByTeacheridAndClassid(teacherId, classId);
    }

    public List<Quiz> getQuizzesByClassId(String classId) {
        return quizRepository.findByClassid(classId);
    }

    public Quiz getQuizById(String quizId) {
        return quizRepository.findById(quizId).orElse(null);
    }

    public void saveEditChanges(Quiz quiz, QuizEditRequest quizEditRequest) {
        quiz.setQuizname(quizEditRequest.getQuizName());
        quiz.setDueDateTime(quizEditRequest.getDueDateTime());
        quiz.setQuizanswerkey(quizEditRequest.getAnswerKeys());
        quizRepository.save(quiz);
    }

    public void deleteQuiz(String quizId) {
        if (quizId == null || quizId.isEmpty()) {
            throw new IllegalArgumentException("Quiz ID must not be null or empty");
        }
        if (!quizRepository.existsById(quizId)) {
            throw new IllegalArgumentException("Quiz with ID " + quizId + " does not exist");
        }
        quizRepository.deleteById(quizId);
    }

    public List<Quiz> getQuizzesByClassIds(List<String> classIds) {
        return quizRepository.findByClassidIn(classIds);
    }

    public Quiz getQuizByQuizId(String quizId) {
        return quizRepository.findById(quizId).orElse(null);
    }

}

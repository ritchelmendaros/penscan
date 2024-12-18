package com.softeng.penscan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.softeng.penscan.model.StudentQuiz;

public interface StudentQuizRepository extends MongoRepository<StudentQuiz, String> {

    Optional<StudentQuiz> findByStudentid(String studentId);

    Optional<StudentQuiz> findByStudentidAndQuizid(String studentId, String quizId);

    List<StudentQuiz> findByQuizid(String quizId);

    void deleteAllByStudentidAndQuizid(String studentId, String quizId);

    List<StudentQuiz> findAllByStudentidAndQuizidIn(String studentId, List<String> quizIds);

    int countByQuizid(String quizid);

    List<StudentQuiz> findByQuizidIn(List<String> quizIds);

}

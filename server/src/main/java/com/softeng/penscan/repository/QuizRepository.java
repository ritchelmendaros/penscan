package com.softeng.penscan.repository;

import java.util.List;
import com.softeng.penscan.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByTeacheridAndClassid(String teacherId, String classId);
}

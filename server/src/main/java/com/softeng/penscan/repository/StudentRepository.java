package com.softeng.penscan.repository;

import com.softeng.penscan.model.Student;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {

    Optional<Student> findByUserid(String userid);

    String getStudentidByUserid(String userid);

    String findStudentidByUserid(String userid);

    List<Student> findByClassid(String classId);

}

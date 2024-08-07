package com.softeng.penscan.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.softeng.penscan.model.Teacher;

public interface TeacherRepository extends MongoRepository<Teacher, String> {

}

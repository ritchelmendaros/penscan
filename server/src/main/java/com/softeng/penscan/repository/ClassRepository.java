package com.softeng.penscan.repository;

import com.softeng.penscan.model.Class;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends MongoRepository<Class, String> {

    Class findByTeacherid(String teacherid);

    List<Class> findAllByTeacherid(String teacherid);

    boolean existsByClassnameAndTeacherid(String classname, String teacherid);
}

package com.softeng.penscan.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.softeng.penscan.model.ItemAnalysis;

@Repository
public interface ItemAnalysisRepository extends MongoRepository<ItemAnalysis, String> {

    List<ItemAnalysis> findByQuizid(String quizid);

}

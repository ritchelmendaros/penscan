package com.softeng.penscan.controller;

import com.softeng.penscan.model.ItemAnalysis;
import com.softeng.penscan.repository.ItemAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/item-analysis")
public class ItemAnalysisController {

    @Autowired
    private ItemAnalysisRepository itemAnalysisRepository;

    @GetMapping("/getitemanalysis")
    public List<ItemAnalysis> getItemAnalysisByQuizId(@RequestParam("quizid") String quizId) {
        return itemAnalysisRepository.findByQuizid(quizId);
    }
}

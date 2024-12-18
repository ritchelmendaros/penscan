package com.softeng.penscan.service;

import com.softeng.penscan.model.ItemAnalysis;
import com.softeng.penscan.repository.ItemAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ItemAnalysisService {

    @Autowired
    private ItemAnalysisRepository itemAnalysisRepository;

    public void updateItemAnalysis(String quizId, int itemNumber, boolean isCorrect) {
        // Find the item analysis for the given quiz ID and item number
        Optional<ItemAnalysis> itemAnalysisOpt = itemAnalysisRepository.findByQuizidAndItemNumber(quizId, itemNumber);

        if (itemAnalysisOpt.isPresent()) {
            ItemAnalysis itemAnalysis = itemAnalysisOpt.get();
            if (isCorrect) {
                itemAnalysis.incrementCorrectCount();
            } else {
                itemAnalysis.incrementIncorrectCount();
            }

            // Save the updated item analysis
            itemAnalysisRepository.save(itemAnalysis);
        } else {

        }
    }

    public void saveItemAnalysis(ItemAnalysis itemAnalysis) {
        itemAnalysisRepository.save(itemAnalysis);
    }

    public ItemAnalysis getItemAnalysis(String quizId, int itemId) {
        return itemAnalysisRepository.findByQuizidAndItemNumber(quizId, itemId)
                .orElse(null);
    }

}

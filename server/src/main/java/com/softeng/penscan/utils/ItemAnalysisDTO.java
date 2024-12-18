package com.softeng.penscan.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemAnalysisDTO {
    private int itemNumber;
    private int correctCount;
    private int incorrectCount;
    private double difficultyIndex;
    private String difficultyInterpretation;
    private double discriminationIndex;
    private String discriminationInterpretation;
    private String suggestedDecision;
}

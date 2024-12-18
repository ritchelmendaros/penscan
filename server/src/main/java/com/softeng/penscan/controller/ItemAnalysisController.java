package com.softeng.penscan.controller;

import com.softeng.penscan.model.ItemAnalysis;
import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.model.StudentQuiz;
import com.softeng.penscan.repository.ClassRepository;
import com.softeng.penscan.repository.ItemAnalysisRepository;
import com.softeng.penscan.repository.QuizRepository;
import com.softeng.penscan.repository.StudentQuizRepository;
import com.softeng.penscan.service.StudentQuizService;
import com.softeng.penscan.utils.ItemAnalysisDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/item-analysis")
public class ItemAnalysisController {

    @Autowired
    private ItemAnalysisRepository itemAnalysisRepository;

    @Autowired
    private StudentQuizService studentQuizService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @GetMapping("/getitemanalysis")
    public List<ItemAnalysisDTO> getItemAnalysisByQuizId(@RequestParam("quizid") String quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        int totalStudents = studentQuizRepository.countByQuizid(quizId);
        List<ItemAnalysis> itemAnalyses = itemAnalysisRepository.findByQuizid(quizId);
        List<StudentQuiz> highScorers = studentQuizService.getHighScorersByQuizId(quizId);
        List<StudentQuiz> lowScorers = studentQuizService.getLowScorersByQuizId(quizId);

        Map<Integer, Long> highScorerCorrectCounts = calculateCorrectCounts(highScorers);
        Map<Integer, Long> lowScorerCorrectCounts = calculateCorrectCounts(lowScorers);

        return itemAnalyses.parallelStream()
                .map(item -> {
                    double p = calculateDifficultyIndex(item.getCorrectCount(), totalStudents);
                    String pInterpretation = interpretDifficultyIndex(p);

                    double highScorerProportion = highScorerCorrectCounts.getOrDefault(item.getItemNumber(), 0L)
                            / (double) totalStudents;
                    double lowScorerProportion = lowScorerCorrectCounts.getOrDefault(item.getItemNumber(), 0L)
                            / (double) totalStudents;

                    double d = highScorerProportion - lowScorerProportion;
                    String dInterpretation = interpretDiscriminationIndex(d);

                    return new ItemAnalysisDTO(
                            item.getItemNumber(),
                            item.getCorrectCount(),
                            item.getIncorrectCount(),
                            p,
                            pInterpretation,
                            d,
                            dInterpretation,
                            suggestDecision(p, d));
                })
                .collect(Collectors.toList());
    }

    private double calculateDifficultyIndex(int correctCount, int totalStudents) {
        if (correctCount == 0) {
            return 0.0;
        }
        double result = (double) correctCount / totalStudents;
        return Math.round(result * 100.0) / 100.0;
    }

    private Map<Integer, Long> calculateCorrectCounts(List<StudentQuiz> studentQuizzes) {
        return studentQuizzes.stream()
                .flatMap(studentQuiz -> studentQuiz.getRecognizedAnswers().stream())
                .filter(answer -> answer.isCorrect())
                .collect(Collectors.groupingBy(
                        answer -> answer.getItemnumber(),
                        Collectors.counting()));
    }

    private String interpretDifficultyIndex(double p) {
        if (p >= 0.00 && p <= 0.30) {
            return "Very Difficult";
        } else if (p > 0.30 && p <= 0.50) {
            return "Difficult";
        } else if (p > 0.50 && p <= 0.70) {
            return "Moderately Difficult";
        } else if (p > 0.70 && p <= 1.00) {
            return "Easy";
        } else {
            return "Invalid Index";
        }
    }

    private String interpretDiscriminationIndex(double d) {
        if (d >= 0.40) {
            return "Very Discriminating (Excellent)";
        } else if (d >= 0.30) {
            return "Discriminating (Good)";
        } else if (d >= 0.20) {
            return "Moderately Discriminating (Acceptable)";
        } else if (d >= 0.10) {
            return "Low Discrimination (Needs Revision)";
        } else {
            return "Very Low (Should be Revised or Discarded)";
        }
    }

    private String suggestDecision(double p, double d) {
        if (p > 0.30 && p < 0.70 && d >= 0.30) {
            return "Accepted as it is (No revision needed)";
        } else if (p > 0.30 && p < 0.70 && d >= 0.20 && d < 0.30) {
            return "Accepted with very slight revision";
        } else if (p > 0.30 && p < 0.70 && d >= 0.10 && d < 0.20) {
            return "Accepted with slight revision";
        } else if (p >= 0.20 && p <= 0.30 && d >= 0.20 && d < 0.30) {
            return "May be accepted with minor revision";
        } else if (p >= 0.20 && p < 0.50 && d >= 0.10 && d < 0.20) {
            return "Major revision on the stem/choices";
        } else if (p < 0.20 && d < 0.20 || p > 0.80 && d < 0.20) {
            return "Needs major revision or discarded";
        } else if (p < 0.10 || p > 0.90 || d < 0.10) {
            return "Totally discarded";
        } else {
            return "Review";
        }
    }
}

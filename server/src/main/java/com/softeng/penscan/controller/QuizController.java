package com.softeng.penscan.controller;

import java.util.List;
import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/addquiz")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        return quizService.addQuiz(quiz);
    }

    @GetMapping("/getquizbyteacherid")
    public List<Quiz> getQuizzesByTeacherId(@RequestParam("teacherid") String teacherId,
            @RequestParam("classid") String classId) {
        return quizService.getQuizzesByTeacherIdAndClassId(teacherId, classId);
    }

    @GetMapping("/getanswerkey")
    public String getAnswerKeyByQuizId(@RequestParam("quizid") String quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz != null) {
            return quiz.getQuizanswerkey();
        } else {
            return "Quiz not found";
        }
    }

}

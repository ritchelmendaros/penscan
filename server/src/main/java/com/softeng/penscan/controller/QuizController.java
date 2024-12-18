package com.softeng.penscan.controller;

import java.util.List;
import com.softeng.penscan.model.ItemAnalysis;
import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.model.Quiz.AnswerKeyItem;
import com.softeng.penscan.model.Student;
import com.softeng.penscan.repository.ActivityLogRepository;
import com.softeng.penscan.repository.ItemAnalysisRepository;
import com.softeng.penscan.model.StudentQuiz;
import com.softeng.penscan.service.QuizService;
import com.softeng.penscan.service.StudentQuizService;
import com.softeng.penscan.service.StudentService;
import com.softeng.penscan.utils.AnswerKeyResponse;
import com.softeng.penscan.utils.QuizEditRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private StudentQuizService studentQuizService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ItemAnalysisRepository itemAnalysisRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @PostMapping("/addquiz")
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        List<AnswerKeyItem> answerKey = quiz.getQuizanswerkey();
        if (answerKey == null || answerKey.isEmpty()) {
            throw new IllegalArgumentException("Answer key cannot be empty");
        }

        for (AnswerKeyItem answerKeyItem : answerKey) {
            if (answerKeyItem.getItemnumber() <= 0) {
                throw new IllegalArgumentException("Invalid item number: " + answerKeyItem.getItemnumber());
            }
            if (answerKeyItem.getAnswer() == null || answerKeyItem.getAnswer().isEmpty()) {
                throw new IllegalArgumentException(
                        "Answer cannot be null or empty for item number: " + answerKeyItem.getItemnumber());
            }
        }
        return quizService.addQuiz(quiz);
    }

    @GetMapping("/getquizbyteacherid")
    public List<Quiz> getQuizzesByTeacherId(@RequestParam("teacherid") String teacherId,
            @RequestParam("classid") String classId) {
        return quizService.getQuizzesByTeacherIdAndClassId(teacherId, classId);
    }

    @GetMapping("/getquizbyclassid")
    public List<Quiz> getQuizzesByClassId(@RequestParam("classid") String classId) {
        return quizService.getQuizzesByClassId(classId);
    }

    @GetMapping("/getanswerkey")
    public AnswerKeyResponse getAnswerKeyByQuizId(@RequestParam("quizid") String quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz != null) {
            return new AnswerKeyResponse(quiz.getQuizanswerkey(), quiz.getDueDateTime());
        } else {
            throw new IllegalArgumentException("Quiz not found");
        }
    }

    // @PutMapping("/edit")
    // public ResponseEntity<String> editQuiz(@RequestBody QuizEditRequest
    // quizEditRequest) {
    // Quiz quiz = quizService.getQuizById(quizEditRequest.getQuizId());
    // if (quiz != null) {
    // quizService.saveEditChanges(quiz, quizEditRequest);
    // return ResponseEntity.ok("Quiz updated successfully.");
    // }
    // return ResponseEntity.ok("Quiz does not exists.");
    // }
    @PutMapping("/edit")
    public ResponseEntity<String> editQuiz(@RequestBody QuizEditRequest quizEditRequest) {
        Quiz quiz = quizService.getQuizById(quizEditRequest.getQuizId());

        if (quiz != null) {
            boolean isAnswerKeyEdited = !quiz.getQuizanswerkey().equals(quizEditRequest.getAnswerKeys());

            // If the answer key has been edited, update all associated StudentQuiz records
            if (isAnswerKeyEdited) {
                List<StudentQuiz> studentQuizzes = studentQuizService.getStudentQuizzesByQuizId(quiz.getQuizid());

                // Fetch the list of ItemAnalysis records for the quiz
                List<ItemAnalysis> itemAnalysisList = itemAnalysisRepository.findByQuizid(quiz.getQuizid());

                // Re-evaluate each student quiz
                for (StudentQuiz studentQuiz : studentQuizzes) {
                    studentQuizService.reEvaluateQuiz(studentQuiz, quizEditRequest.getAnswerKeys(), itemAnalysisList);
                }
            }
            quizService.saveEditChanges(quiz, quizEditRequest);

            return ResponseEntity.ok("Quiz updated successfully.");
        }
        return ResponseEntity.ok("Quiz does not exist.");
    }

    @DeleteMapping("/deletequiz")
    public ResponseEntity<String> deleteQuiz(@RequestParam("quizid") String quizId) {
        // Delete the Quiz
        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz == null) {
            return ResponseEntity.badRequest().body("Quiz not found");
        }
        quizService.deleteQuiz(quizId);

        // Delete all StudentQuiz records related to the quiz
        List<StudentQuiz> studentQuizzes = studentQuizService.getStudentQuizzesByQuizId(quizId);
        for (StudentQuiz studentQuiz : studentQuizzes) {
            List<String> activityLogIds = studentQuiz.getActivityLogIds();
            if (activityLogIds != null && !activityLogIds.isEmpty()) {
                activityLogRepository.deleteByIdIn(activityLogIds);
            }
            // Then delete the StudentQuiz record
            studentQuizService.deleteStudentQuiz(studentQuiz.getStudentquizid());
        }

        // Delete all ItemAnalysis records related to the quiz
        List<ItemAnalysis> itemAnalysisList = itemAnalysisRepository.findByQuizid(quizId);
        for (ItemAnalysis itemAnalysis : itemAnalysisList) {
            itemAnalysisRepository.deleteById(itemAnalysis.getItemanalysisid());
        }

        // Remove the quizId from all Student records (if applicable)
        List<Student> students = studentService.getStudentsByQuizId(quizId);
        for (Student student : students) {
            student.getQuizid().remove(quizId);
            studentService.save(student);
        }

        return ResponseEntity.ok("Quiz and related data deleted successfully.");
    }

}

package com.softeng.penscan.controller;

import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.softeng.penscan.model.StudentQuiz;
import com.softeng.penscan.model.User;
import com.softeng.penscan.repository.StudentQuizRepository;
import com.softeng.penscan.repository.UserRepository;
import com.softeng.penscan.service.StudentQuizService;
import com.softeng.penscan.utils.EditStudentQuizRequest;

import java.io.IOException;

@RestController
@RequestMapping("/api/studentquiz")
public class StudentQuizController {

    @Autowired
    private StudentQuizService studentQuizService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadStudentQuiz(@RequestParam("quizid") String quizid,
            @RequestParam("image") MultipartFile image) {
        try {
            String studentQuizId = studentQuizService.addStudentQuiz(quizid, image);
            return new ResponseEntity<>("Student quiz saved successfully with ID: " + studentQuizId, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (IOException | InterruptedException e) {
            return new ResponseEntity<>("Error saving student quiz: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<Object> getStudentQuizByStudentIdAndQuizId(
            @RequestParam("studentid") String studentId,
            @RequestParam("quizid") String quizId) {

        StudentQuiz studentQuiz = studentQuizService.getStudentQuizByStudentIdAndQuizId(studentId, quizId);
        if (studentQuiz != null) {
            Binary imageData = studentQuiz.getQuizimage();
            if (imageData != null) {
                byte[] imageBytes = imageData.getData();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                studentQuiz.setBase64Image(base64Image);
            }
            return new ResponseEntity<>(studentQuiz, HttpStatus.OK);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No data found for the student ID and quiz ID");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getscoresandstudentids")
    public ResponseEntity<Map<String, Map<String, String>>> getScoresAndStudentIdsByQuizId(
            @RequestParam("quizid") String quizId) {

        List<StudentQuiz> studentQuizzes = studentQuizRepository.findByQuizid(quizId);
        Map<String, Map<String, String>> scoresAndStudentDetails = new HashMap<>();

        for (StudentQuiz studentQuiz : studentQuizzes) {
            String studentId = studentQuiz.getStudentid();
            int score = studentQuiz.getScore();
            Map<String, String> studentDetails = new HashMap<>();

            // Retrieve user details using student ID
            User user = userRepository.findByUserid(studentId);
            if (user != null) {
                String userId = user.getUserid(); // Get the user ID
                String username = user.getUsername(); // Get the username
                String firstName = user.getFirstname(); // Get the first name
                String lastName = user.getLastname(); // Get the last name

                // Add user details to the studentDetails map as text-only values
                studentDetails.put("userId", userId);
                studentDetails.put("username", username);
                studentDetails.put("firstName", firstName);
                studentDetails.put("lastName", lastName);
                studentDetails.put("score", String.valueOf(score)); // Convert score to String
            }

            scoresAndStudentDetails.put(studentId, studentDetails);
        }

        if (!scoresAndStudentDetails.isEmpty()) {
            return new ResponseEntity<>(scoresAndStudentDetails, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<Map<String, String>> editStudentQuiz(@RequestBody EditStudentQuizRequest request) {
        try {
            // Edit the student quiz with the new text
            studentQuizService.editStudentQuiz(request.getStudentQuizId(), request.getNewText());

            // Retrieve the updated student quiz
            StudentQuiz updatedStudentQuiz = studentQuizService.getStudentQuiz(request.getStudentQuizId());

            // Create response map
            Map<String, String> response = new HashMap<>();
            response.put("studentQuizId", updatedStudentQuiz.getStudentquizid());
            response.put("newText", updatedStudentQuiz.getRecognizedtext());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.CONFLICT);
        } catch (IOException e) {
            return new ResponseEntity<>(Map.of("message", "Error updating student quiz: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

package com.softeng.penscan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softeng.penscan.model.Student;
import com.softeng.penscan.utils.QuizDTO;
import com.softeng.penscan.service.StudentService;
import com.softeng.penscan.service.UserService;
import com.softeng.penscan.utils.StudentClassResponse;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.softeng.penscan.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;
    @Autowired
    private UserService userService;

    @PostMapping("/addstudent")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student addedStudent = studentService.addStudent(student);
        return new ResponseEntity<>(addedStudent, HttpStatus.CREATED);
    }

    @PutMapping("/addclasstostudent")
    public ResponseEntity<Object> addClassToStudent(
            @RequestParam("userid") String userid,
            @RequestParam("classid") String classid) {
        try {
            StudentClassResponse response = studentService.addClassToStudentAndClass(userid, classid);
            ObjectMapper objectMapper = new ObjectMapper();
            String responseJson = objectMapper.writeValueAsString(response);
            return ResponseEntity.ok(responseJson);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            String errorMessage = "Error adding class to student: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @GetMapping("/getclassidsbyuserid")
    public ResponseEntity<List<String>> getClassIdsByUserId(@RequestParam("userid") String userid) {
        try {
            List<String> classIds = studentService.getClassIdsByUserId(userid);
            if (!classIds.isEmpty()) {
                return ResponseEntity.ok(classIds);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(classIds);
            }
        } catch (Exception e) {
            String errorMessage = "Error getting class IDs for user with ID " + userid;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(errorMessage));
        }
    }

    @GetMapping("/getstudentsbyclassid")
    public ResponseEntity<?> getStudentsByClassId(@RequestParam("classid") String classId) {
        try {
            List<Student> students = studentService.getStudentsByClassId(classId);
            if (!students.isEmpty()) {
                List<User> userList = new ArrayList<>();
                for (Student student : students) {
                    User user = userService.getUserDetailsByUserId(student.getUserid());
                    userList.add(user);
                }
                return ResponseEntity.ok(userList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No students found for class with ID " + classId);
            }
        } catch (Exception e) {
            String errorMessage = "Error getting students for class with ID " + classId;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @GetMapping("/getquizidsandnamesbyuseridandclassid")
    public ResponseEntity<List<QuizDTO>> getQuizIdsAndNamesByUserIdAndClassId(
            @RequestParam("userid") String userId,
            @RequestParam("classid") String classId) {
        try {
            List<String> quizIds = studentService.getQuizIdsByUserIdAndClassId(userId, classId);
            List<QuizDTO> quizDetails = new ArrayList<>();
            for (String quizId : quizIds) {
                String quizName = studentService.getQuizNameById(quizId);
                quizDetails.add(new QuizDTO(quizId, quizName));
            }
            if (!quizDetails.isEmpty()) {
                return ResponseEntity.ok(quizDetails);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception e) {
            String errorMessage = "Error getting quiz IDs and names for user with ID " + userId + " and class ID "
                    + classId;
            QuizDTO errorDTO = new QuizDTO(null, null); 
            List<QuizDTO> errorList = new ArrayList<>();
            errorList.add(errorDTO);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorList);
        }

    }

}

package com.softeng.penscan.controller;

import com.softeng.penscan.model.*;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.time.LocalDateTime;

import com.softeng.penscan.model.StudentQuiz.RecognizedAnswer;
import com.softeng.penscan.repository.ActivityLogRepository;
import com.softeng.penscan.repository.StudentQuizRepository;
import com.softeng.penscan.repository.StudentRepository;
import com.softeng.penscan.repository.UserRepository;
import com.softeng.penscan.service.ItemAnalysisService;
import com.softeng.penscan.service.QuizService;
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
    private StudentRepository studentRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private QuizService quizService;

    @Autowired
    private ItemAnalysisService itemAnalysisService;

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

    @PostMapping("/studentupload")
    public ResponseEntity<Map<String, String>> studentuploadStudentQuiz(@RequestParam("quizid") String quizid,
            @RequestParam("userid") String userid,
            @RequestParam("image") MultipartFile image) {
        try {
            String studentQuizId = studentQuizService.addStudentQuiz(quizid, userid, image);
            Map<String, String> response = new HashMap<>();

            response.put("studentQuizId", studentQuizId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
        } catch (IOException | InterruptedException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put(" ", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<Object> getStudentQuizByStudentIdAndQuizId(
            @RequestParam("studentid") String studentid,
            @RequestParam("quizid") String quizid) {

        StudentQuiz studentQuiz = studentQuizService.getStudentQuizByStudentIdAndQuizId(studentid, quizid);
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

        // Fetch all student quizzes by quizId
        List<StudentQuiz> studentQuizzes = studentQuizRepository.findByQuizid(quizId);
        if (studentQuizzes.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Extract studentIds from studentQuizzes
        List<String> studentIds = studentQuizzes.stream()
                .map(StudentQuiz::getStudentid)
                .collect(Collectors.toList());

        // Fetch all users in a single batch
        Map<String, User> userMap = userRepository.findByUseridIn(studentIds)
                .stream()
                .collect(Collectors.toMap(User::getUserid, user -> user));

        // Fetch quiz once
        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Preload ActivityLogs for all students (batch fetch)
        Set<String> activityLogIds = studentQuizzes.stream()
                .flatMap(studentQuiz -> studentQuiz.getActivityLogIds().stream())
                .collect(Collectors.toSet());
        Map<String, ActivityLog> activityLogMap = activityLogRepository.findByIdIn(activityLogIds)
                .stream()
                .collect(Collectors.toMap(ActivityLog::getId, activityLog -> activityLog));

        // Create result map
        Map<String, Map<String, String>> scoresAndStudentDetails = new HashMap<>();

        for (StudentQuiz studentQuiz : studentQuizzes) {
            String studentId = studentQuiz.getStudentid();
            User user = userMap.get(studentId);
            if (user == null) {
                continue;
            }

            // Build student details map
            Map<String, String> studentDetails = new HashMap<>();
            studentDetails.put("dueDateTime", quiz.getDueDateTime().toString());
            studentDetails.put("userId", user.getUserid());
            studentDetails.put("username", user.getUsername());
            studentDetails.put("firstName", user.getFirstname());
            studentDetails.put("lastName", user.getLastname());
            studentDetails.put("score", String.valueOf(studentQuiz.getScore()));
            studentDetails.put("editedStatus", studentQuiz.getEditedstatus().name());
            studentDetails.put("finalScore", String.valueOf(studentQuiz.getFinalscore()));

            // Fetch the last modified time from preloaded activity logs
            LocalDateTime lastModified = getLastModifiedFromActivityLogs(studentQuiz.getActivityLogIds(),
                    activityLogMap);
            studentDetails.put("lastModified", lastModified != null ? lastModified.toString() : "N/A");

            // Add student details to the final result
            scoresAndStudentDetails.put(studentId, studentDetails);
        }

        return new ResponseEntity<>(scoresAndStudentDetails, HttpStatus.OK);
    }

    // Optimized method to get the last modified timestamp from preloaded
    // ActivityLogs
    private LocalDateTime getLastModifiedFromActivityLogs(List<String> activityLogIds,
            Map<String, ActivityLog> activityLogMap) {
        return activityLogIds.stream()
                .map(activityLogMap::get)
                .filter(Objects::nonNull)
                .map(ActivityLog::getTimestamp)
                .max(Comparator.naturalOrder())
                .orElse(null);
    }

    @PutMapping("/edit") // teacheredit
    public ResponseEntity<Map<String, Object>> editStudentQuiz(@RequestBody EditStudentQuizRequest request) {

        try {
            studentQuizService.editStudentQuiz(request.getStudentQuizId(), request.getUserId(), request.getNewText(),
                    request.getComment(),
                    request.getEditedAnswer(), request.getBonusScore(),
                    request.getEditedStatus());

            // Retrieve the updated student quiz
            StudentQuiz updatedStudentQuiz = studentQuizService.getStudentQuiz(request.getStudentQuizId());

            // Create response map
            Map<String, Object> response = new HashMap<>();
            response.put("studentQuizId", updatedStudentQuiz.getStudentquizid());
            response.put("comment", updatedStudentQuiz.getComment());
            response.put("editedAnswer", updatedStudentQuiz.getEditedanswer());
            response.put("bonusScore", String.valueOf(updatedStudentQuiz.getBonusscore()));
            response.put("editedStatus", updatedStudentQuiz.getEditedstatus().name());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.CONFLICT);
        } catch (IOException e) {
            return new ResponseEntity<>(Map.of("message", "Error updating student quiz: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/studentedit")
    public ResponseEntity<Map<String, Object>> studenteditStudentQuiz(@RequestBody EditStudentQuizRequest request) {

        try {
            studentQuizService.editStudentQuiz(request.getStudentQuizId(), request.getUserId(), request.getNewText(),
                    request.getEditedAnswer(), request.getEditedStatus());

            // Retrieve the updated student quiz
            StudentQuiz updatedStudentQuiz = studentQuizService.getStudentQuiz(request.getStudentQuizId());

            // Create response map
            Map<String, Object> response = new HashMap<>();
            response.put("studentQuizId", updatedStudentQuiz.getStudentquizid());
            response.put("comment", updatedStudentQuiz.getComment());
            response.put("editedAnswer", updatedStudentQuiz.getEditedanswer());
            response.put("bonusScore", String.valueOf(updatedStudentQuiz.getBonusscore()));
            response.put("editedStatus", updatedStudentQuiz.getEditedstatus().name());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.CONFLICT);
        } catch (IOException e) {
            return new ResponseEntity<>(Map.of("message", "Error updating student quiz: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/approve")
    public ResponseEntity<Map<String, Object>> approveEditedAnswer(
            @RequestParam("studentQuizId") String studentQuizId,
            @RequestParam("userId") String userId,
            @RequestParam("editedItem") String editedItem,
            @RequestParam("itemId") int itemId) {
        try {
            // Retrieve the student's quiz record
            StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);
            if (studentQuiz == null) {
                return new ResponseEntity<>(Map.of("message", "Student quiz not found"), HttpStatus.NOT_FOUND);
            }

            // Retrieve the quiz associated with the student quiz to get the answer key
            Quiz quiz = quizService.getQuizById(studentQuiz.getQuizid());
            if (quiz == null) {
                return new ResponseEntity<>(Map.of("message", "Quiz not found"), HttpStatus.NOT_FOUND);
            }

            // Find the correct answer for the provided itemId
            String correctAnswer = null;
            for (Quiz.AnswerKeyItem answerKey : quiz.getQuizanswerkey()) {
                if (answerKey.getItemnumber() == itemId) {
                    correctAnswer = answerKey.getAnswer();
                    break;
                }
            }

            // Check if the itemId is valid
            if (correctAnswer == null) {
                return new ResponseEntity<>(Map.of("message", "Invalid itemId"), HttpStatus.BAD_REQUEST);
            }

            boolean found = false;
            boolean previouslyCorrect = false;

            // Check recognized answers to see if it was previously correct
            for (RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
                if (recognizedAnswer.getItemnumber() == itemId) {
                    previouslyCorrect = recognizedAnswer.isCorrect();
                    break;
                }
            }

            for (StudentQuiz.EditedAnswer answer : studentQuiz.getEditedanswer()) {
                if (answer.getItemnumber() == itemId) {
                    if (!answer.isIsapproved()) {
                        answer.approve();
                        found = true;

                        // Compare the edited answer with the correct answer
                        boolean isCorrect = editedItem.trim().equalsIgnoreCase(correctAnswer);

                        // Update item analysis with the result
                        studentQuiz.updateItemAnalysis(itemId, isCorrect);

                        // Retrieve the item analysis for the current quiz and item number
                        ItemAnalysis itemAnalysis = itemAnalysisService.getItemAnalysis(studentQuiz.getQuizid(),
                                itemId);
                        if (itemAnalysis == null) {
                            return new ResponseEntity<>(Map.of("message", "Item analysis not found"),
                                    HttpStatus.NOT_FOUND);
                        }

                        // Update the correctCount or incorrectCount based on correctness
                        if (!previouslyCorrect && isCorrect) {
                            // Previous was incorrect, now correct
                            studentQuiz.incrementScore();
                            itemAnalysis.setCorrectCount(itemAnalysis.getCorrectCount() + 1);
                            itemAnalysis.setIncorrectCount(Math.max(0, itemAnalysis.getIncorrectCount() - 1));
                            for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
                                if (recognizedAnswer.getItemnumber() == itemId) {
                                    recognizedAnswer.setCorrect(true);
                                    break;
                                }
                            }
                        } else if (previouslyCorrect && !isCorrect) {
                            // Previous was correct, now incorrect
                            studentQuiz.decrementScore();
                            itemAnalysis.setIncorrectCount(itemAnalysis.getIncorrectCount() + 1);
                            itemAnalysis.setCorrectCount(Math.max(0, itemAnalysis.getCorrectCount() - 1));
                            for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
                                if (recognizedAnswer.getItemnumber() == itemId) {
                                    recognizedAnswer.setCorrect(false);
                                    break;
                                }
                            }
                        } else if (!previouslyCorrect && !isCorrect) {
                            for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
                                if (recognizedAnswer.getItemnumber() == itemId) {
                                    recognizedAnswer.setCorrect(false);
                                    break;
                                }
                            }
                        } else if (previouslyCorrect && isCorrect) {
                            for (StudentQuiz.RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
                                if (recognizedAnswer.getItemnumber() == itemId) {
                                    recognizedAnswer.setCorrect(true);
                                    break;
                                }
                            }
                        }

                        itemAnalysisService.saveItemAnalysis(itemAnalysis);
                    } else {
                        return new ResponseEntity<>(Map.of("message", "Edited answer already approved"),
                                HttpStatus.CONFLICT);
                    }
                    break;
                }
            }

            if (!found) {
                return new ResponseEntity<>(Map.of("message", "Edited answer not found"), HttpStatus.NOT_FOUND);
            }

            // Check if all answers are approved or disapproved
            boolean allApprovedOrDisapproved = studentQuiz.getEditedanswer().stream()
                    .allMatch(answer -> answer.isIsapproved() || answer.isIsdisapproved());

            if (allApprovedOrDisapproved) {
                studentQuiz.setEditedstatus(StudentQuiz.EditedStatus.APPROVED);
            }

            studentQuizRepository.save(studentQuiz);

            ActivityLog activityLog = ActivityLog.create(userId, ActivityLog.Activity.APPROVE);
            activityLogRepository.save(activityLog);

            if (studentQuiz.getActivityLogIds() == null) {
                studentQuiz.setActivityLogIds(new ArrayList<>());
            }
            studentQuiz.getActivityLogIds().add(activityLog.getId());

            studentQuizRepository.save(studentQuiz);

            // Prepare the response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Edited answer approved successfully");
            response.put("studentQuizId", studentQuizId);
            response.put("editedItem", editedItem);
            response.put("isApproved", true);
            response.put("isCorrect", editedItem.trim().equalsIgnoreCase(correctAnswer));

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error approving edited answer: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/disapprove")
    public ResponseEntity<Map<String, Object>> disapproveEditedAnswer(
            @RequestParam("studentQuizId") String studentQuizId,
            @RequestParam("userId") String userId,
            @RequestParam("editedItem") String editedItem) {
        try {
            StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);
            if (studentQuiz == null) {
                return new ResponseEntity<>(Map.of("message", "Student quiz not found"), HttpStatus.NOT_FOUND);
            }
            boolean found = false;
            for (StudentQuiz.EditedAnswer answer : studentQuiz.getEditedanswer()) {
                if (answer.getEditeditem().equals(editedItem)) {
                    if ((answer.isIsapproved() || !answer.isIsapproved()) && !answer.isIsdisapproved()) {
                        answer.disapprove();
                        found = true;
                    } else if (answer.isIsdisapproved()) {
                        return new ResponseEntity<>(Map.of("message", "Edited answer is already disapproved"),
                                HttpStatus.CONFLICT);
                    } else {
                        return new ResponseEntity<>(Map.of("message", "Edited answer is not approved"),
                                HttpStatus.CONFLICT);
                    }
                    break;
                }
            }

            if (!found) {
                return new ResponseEntity<>(Map.of("message", "Edited answer not found"), HttpStatus.NOT_FOUND);
            }

            boolean allApprovedOrDisapproved = studentQuiz.getEditedanswer().stream()
                    .allMatch(answer -> answer.isIsapproved() || answer.isIsdisapproved());

            if (allApprovedOrDisapproved) {
                studentQuiz.setEditedstatus(StudentQuiz.EditedStatus.APPROVED);
            }

            studentQuizRepository.save(studentQuiz);
            ActivityLog activityLog = ActivityLog.create(userId, ActivityLog.Activity.DISAPPROVE);
            activityLogRepository.save(activityLog);

            if (studentQuiz.getActivityLogIds() == null) {
                studentQuiz.setActivityLogIds(new ArrayList<>());
            }
            studentQuiz.getActivityLogIds().add(activityLog.getId());

            studentQuizRepository.save(studentQuiz);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Edited answer disapproved successfully");
            response.put("studentQuizId", studentQuizId);
            response.put("editedItem", editedItem);
            response.put("isApproved", false);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error disapproving edited answer: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteStudentQuiz(@RequestParam("studentId") String studentId,
            @RequestParam("quizId") String quizId) {
        try {

            // Fetch the student quiz using studentId as userId and quizId
            StudentQuiz studentQuiz = studentQuizRepository.findByStudentidAndQuizid(studentId, quizId)
                    .orElseThrow(() -> new IllegalArgumentException("Student quiz not found"));

            // Fetch the student associated with the userId
            Student student = studentRepository.findByUserid(studentId)
                    .orElseThrow(() -> new IllegalArgumentException("Student not found"));

            // Remove the quizId from the student's list of quizzes
            List<String> studentQuizzes = student.getQuizid();
            if (studentQuizzes != null && studentQuizzes.contains(quizId)) {
                studentQuizzes.remove(quizId);
                student.setQuizid(studentQuizzes);

                // Save the updated student entity
                studentRepository.save(student);
            }

            // Update the correct and incorrect counts in ItemAnalysis based on
            // RecognizedAnswers
            for (RecognizedAnswer recognizedAnswer : studentQuiz.getRecognizedAnswers()) {
                // Get item ID and correctness
                int itemId = recognizedAnswer.getItemnumber();
                boolean isCorrect = recognizedAnswer.isCorrect();

                // Fetch the ItemAnalysis for the quiz and item
                ItemAnalysis itemAnalysis = itemAnalysisService.getItemAnalysis(quizId, itemId);
                if (itemAnalysis != null) {
                    if (isCorrect) {
                        // Decrement the correct count
                        itemAnalysis.setCorrectCount(Math.max(0, itemAnalysis.getCorrectCount() - 1));
                    } else {
                        // Decrement the incorrect count
                        itemAnalysis.setIncorrectCount(Math.max(0, itemAnalysis.getIncorrectCount() - 1));
                    }
                    // Save the updated item analysis
                    itemAnalysisService.saveItemAnalysis(itemAnalysis);
                }
            }

            // Get the studentQuizId
            String studentQuizId = studentQuiz.getStudentquizid();

            // Remove the student quiz last
            studentQuizRepository.deleteById(studentQuizId);

            return new ResponseEntity<>("Student quiz deleted successfully and student/quiz data updated",
                    HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting student quiz: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/logs/all")
    public ResponseEntity<Map<String, Object>> getAllActivityLogs(@RequestParam("studentQuizId") String studentQuizId) {
        try {
            // Fetch the StudentQuiz by ID
            if (studentQuizId == null || studentQuizId.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);

            // Fetch activity logs based on stored activityLogIds in the student quiz
            List<ActivityLog> logs = new ArrayList<>();
            for (String logId : studentQuiz.getActivityLogIds()) {
                ActivityLog log = activityLogRepository.findById(logId)
                        .orElseThrow(() -> new IllegalArgumentException("Activity log not found for ID: " + logId));
                logs.add(log);
            }

            // Sort logs from newest to oldest based on the timestamp
            logs.sort((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp()));

            List<String> formattedLogs = new ArrayList<>();
            for (ActivityLog log : logs) {
                // Fetch the user by userId from the log
                User user = userRepository.findById(log.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found for ID: " + log.getUserId()));

                // Get the user's full name
                String fullName = user.getFirstname() + " " + user.getLastname();

                // Format the log entry with the name and timestamp
                formattedLogs.add(log.getLogEntry(fullName));
            }

            // Prepare the response map
            Map<String, Object> response = new HashMap<>();
            response.put("studentQuizId", studentQuizId);
            response.put("logs", formattedLogs);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error retrieving activity logs: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/markcheck")
    public ResponseEntity<Map<String, Object>> markCheckEditedAnswer(
            @RequestParam("studentQuizId") String studentQuizId,
            @RequestParam("userId") String userId,
            @RequestParam("editedItem") String editedItem,
            @RequestParam("itemId") int itemId) {
        try {
            // Retrieve the student's quiz record
            StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);
            if (studentQuiz == null) {
                return new ResponseEntity<>(Map.of("message", "Student quiz not found"), HttpStatus.NOT_FOUND);
            }

            // Retrieve the associated quiz to validate total items
            Quiz quiz = quizService.getQuizByQuizId(studentQuiz.getQuizid());
            if (quiz == null) {
                return new ResponseEntity<>(Map.of("message", "Quiz not found"), HttpStatus.NOT_FOUND);
            }

            if (itemId > quiz.getTotalitems()) {
                return new ResponseEntity<>(Map.of("message", "Item ID exceeds the total items in the quiz"),
                        HttpStatus.BAD_REQUEST);
            }

            // Locate or initialize the recognized answer
            RecognizedAnswer recognizedAnswer = studentQuiz.getRecognizedAnswers().stream()
                    .filter(answer -> answer.getItemnumber() == itemId)
                    .findFirst()
                    .orElse(null);

            if (recognizedAnswer == null) {
                recognizedAnswer = new StudentQuiz.RecognizedAnswer();
                recognizedAnswer.setItemnumber(itemId);
                recognizedAnswer.setAnswer(editedItem);
                recognizedAnswer.setCorrect(true);
                if (studentQuiz.getRecognizedAnswers() == null) {
                    studentQuiz.setRecognizedAnswers(new ArrayList<>());
                }
                studentQuiz.getRecognizedAnswers().add(recognizedAnswer);
            }

            boolean previouslyCorrect = recognizedAnswer.isCorrect();
            boolean isCorrect = true;

            // Update item analysis
            ItemAnalysis itemAnalysis = itemAnalysisService.getItemAnalysis(studentQuiz.getQuizid(), itemId);
            if (itemAnalysis == null) {
                itemAnalysis = new ItemAnalysis();
                itemAnalysis.setQuizid(studentQuiz.getQuizid());
                itemAnalysis.setItemanalysisid(String.valueOf(itemId));
                itemAnalysis.setCorrectCount(0);
                itemAnalysis.setIncorrectCount(0);
            }

            if (!previouslyCorrect && isCorrect) {
                studentQuiz.incrementScore();
                itemAnalysis.setCorrectCount(itemAnalysis.getCorrectCount() + 1);
            } else if (previouslyCorrect && !isCorrect) {
                studentQuiz.decrementScore();
                itemAnalysis.setIncorrectCount(itemAnalysis.getIncorrectCount() + 1);
            }

            // Update recognized answer
            recognizedAnswer.setCorrect(isCorrect);
            itemAnalysisService.saveItemAnalysis(itemAnalysis);

            // Save updated student quiz
            studentQuizRepository.save(studentQuiz);

            // Log the activity
            ActivityLog activityLog = ActivityLog.create(userId, ActivityLog.Activity.MARKEDCORRECT);
            activityLogRepository.save(activityLog);

            if (studentQuiz.getActivityLogIds() == null) {
                studentQuiz.setActivityLogIds(new ArrayList<>());
            }
            studentQuiz.getActivityLogIds().add(activityLog.getId());
            studentQuizRepository.save(studentQuiz);

            // Prepare the response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Answer marked as checked");
            response.put("studentQuizId", studentQuizId);
            response.put("editedItem", editedItem);
            response.put("isCorrect", isCorrect);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error marking the answer check: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/markuncheck")
    public ResponseEntity<Map<String, Object>> markUnCheckEditedAnswer(
            @RequestParam("studentQuizId") String studentQuizId,
            @RequestParam("userId") String userId,
            @RequestParam("itemId") int itemId) {
        try {
            // Retrieve the student's quiz record
            StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);
            if (studentQuiz == null) {
                return new ResponseEntity<>(Map.of("message", "Student quiz not found"), HttpStatus.NOT_FOUND);
            }
            Quiz quiz = quizService.getQuizById(studentQuiz.getQuizid());
            if (quiz == null) {
                return new ResponseEntity<>(Map.of("message", "Quiz not found"), HttpStatus.NOT_FOUND);
            }
            if (itemId > quiz.getTotalitems()) {
                return new ResponseEntity<>(Map.of("message", "Item exceeds total items in the quiz"),
                        HttpStatus.BAD_REQUEST);
            }

            boolean previouslyCorrect = false;

            // Locate or initialize the recognized answer for the item
            StudentQuiz.RecognizedAnswer recognizedAnswer = studentQuiz.getRecognizedAnswers().stream()
                    .filter(answer -> answer.getItemnumber() == itemId)
                    .findFirst()
                    .orElse(null);

            if (recognizedAnswer == null) {
                recognizedAnswer = new StudentQuiz.RecognizedAnswer();
                recognizedAnswer.setItemnumber(itemId);
                recognizedAnswer.setAnswer("");
                recognizedAnswer.setCorrect(false);
                studentQuiz.getRecognizedAnswers().add(recognizedAnswer);
            } else {
                previouslyCorrect = recognizedAnswer.isCorrect();
                recognizedAnswer.setCorrect(false);
            }

            // Update item analysis and score accordingly
            studentQuiz.updateItemAnalysis(itemId, false);

            ItemAnalysis itemAnalysis = itemAnalysisService.getItemAnalysis(studentQuiz.getQuizid(), itemId);
            if (itemAnalysis == null) {
                // Initialize a new ItemAnalysis if not found
                itemAnalysis = new ItemAnalysis();
                itemAnalysis.setItemanalysisid(String.valueOf(itemId));
                itemAnalysis.setQuizid(studentQuiz.getQuizid());
                itemAnalysis.setCorrectCount(0);
                itemAnalysis.setIncorrectCount(1);
            } else if (previouslyCorrect) {
                // Update existing analysis
                studentQuiz.decrementScore();
                itemAnalysis.setCorrectCount(Math.max(0, itemAnalysis.getCorrectCount() - 1));
                itemAnalysis.setIncorrectCount(itemAnalysis.getIncorrectCount() + 1);
            }

            // Save updated records
            itemAnalysisService.saveItemAnalysis(itemAnalysis);
            studentQuizRepository.save(studentQuiz);

            // Log the activity
            ActivityLog activityLog = ActivityLog.create(userId, ActivityLog.Activity.MARKEDWRONG);
            activityLogRepository.save(activityLog);
            studentQuiz.getActivityLogIds().add(activityLog.getId());
            studentQuizRepository.save(studentQuiz);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Unchecked recognized answer");
            response.put("studentQuizId", studentQuizId);
            response.put("itemId", itemId);
            response.put("isCorrect", false);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error unchecking the recognized answer: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @PutMapping("/addfeedbackperitem")
    // public ResponseEntity<Map<String, Object>> addFeedbackToEditedAnswerPerItem(
    // @RequestParam("studentQuizId") String studentQuizId,
    // @RequestParam("itemId") int itemId,
    // @RequestParam("feedback") String feedback) {
    // try {
    // // Retrieve the student's quiz record
    // StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);
    // if (studentQuiz == null) {
    // return new ResponseEntity<>(Map.of("message", "Student quiz not found"),
    // HttpStatus.NOT_FOUND);
    // }

    // boolean found = false;
    // for (StudentQuiz.EditedAnswer editedAnswer : studentQuiz.getEditedanswer()) {
    // if (editedAnswer.getItemnumber() == itemId) {
    // // Add feedback to the list
    // editedAnswer.getFeedback().add(feedback);
    // found = true;
    // break;
    // }
    // }

    // if (!found) {
    // return new ResponseEntity<>(Map.of("message", "Edited answer not found for
    // the given itemId"),
    // HttpStatus.NOT_FOUND);
    // }

    // // Save the updated student quiz record
    // studentQuizService.saveStudentQuiz(studentQuiz);

    // return new ResponseEntity<>(Map.of("message", ""), HttpStatus.OK);
    // } catch (Exception e) {
    // return new ResponseEntity<>(Map.of("message", "An error occurred", "error",
    // e.getMessage()),
    // HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // }

    @PutMapping("/addfeedbackperitem")
    public ResponseEntity<Map<String, Object>> addFeedbackToEditedAnswerPerItem(
            @RequestParam("studentQuizId") String studentQuizId,
            @RequestParam("itemId") int itemId,
            @RequestParam("feedback") String feedback) {
        try {
            // Retrieve the student's quiz record
            StudentQuiz studentQuiz = studentQuizService.getStudentQuiz(studentQuizId);
            if (studentQuiz == null) {
                return new ResponseEntity<>(Map.of("message", "Student quiz not found"), HttpStatus.NOT_FOUND);
            }

            // Initialize editedanswer if it is null
            if (studentQuiz.getEditedanswer() == null) {
                studentQuiz.setEditedanswer(new ArrayList<>());
            }

            boolean found = false;

            // Loop through existing edited answers
            for (StudentQuiz.EditedAnswer editedAnswer : studentQuiz.getEditedanswer()) {
                if (editedAnswer.getItemnumber() == itemId) {
                    // Add feedback to the existing answer
                    editedAnswer.getFeedback().add(feedback);
                    found = true;
                    break;
                }
            }

            // If no edited answer exists for the itemId, create a new one
            if (!found) {
                StudentQuiz.EditedAnswer newEditedAnswer = new StudentQuiz.EditedAnswer();
                newEditedAnswer.setItemnumber(itemId);
                newEditedAnswer.setEditedItem("");
                newEditedAnswer.setIsapproved(false);
                newEditedAnswer.setIsdisapproved(false);
                newEditedAnswer.setIsedited(false);
                newEditedAnswer.setEditedby("teacher");
                newEditedAnswer.getFeedback().add(feedback);

                // Add the new answer to the list
                studentQuiz.getEditedanswer().add(newEditedAnswer);
            }

            // Save the updated student quiz record
            studentQuizService.saveStudentQuiz(studentQuiz);

            return new ResponseEntity<>(Map.of("message", "Feedback added successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "An error occurred", "error", e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
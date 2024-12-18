package com.softeng.penscan.controller;

import com.softeng.penscan.model.ActivityLog;
import com.softeng.penscan.model.Class;
import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.model.Student;
import com.softeng.penscan.model.StudentQuiz;
import com.softeng.penscan.repository.ActivityLogRepository;
import com.softeng.penscan.repository.ClassRepository;
import com.softeng.penscan.repository.StudentQuizRepository;
import com.softeng.penscan.repository.StudentRepository;
import com.softeng.penscan.repository.UserRepository;
import com.softeng.penscan.service.ClassService;
import com.softeng.penscan.model.User;
import com.softeng.penscan.service.QuizService;
import com.softeng.penscan.service.StudentQuizService;
import com.softeng.penscan.service.UserService;
import com.softeng.penscan.utils.ActivityLogDTO;
import com.softeng.penscan.utils.ClassStudentCountDTO;
import com.softeng.penscan.utils.QuizResultDTO;

import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classesService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizService quizService;

    @Autowired
    private StudentQuizService studentQuizService;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public Class addClass(@RequestBody Class classes) {
        return classesService.addClass(classes);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestParam("userId") String userId,
            @RequestParam("classCode") String classCode) {
        try {
            Optional<Class> classOptional = classRepository.findByClassCode(classCode);
            if (classOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found with classCode: " + classCode);
            }

            Class classObj = classOptional.get();

            if (classObj.getStudentid() == null) {
                classObj.setStudentid(new ArrayList<>());
            }

            if (classObj.getStudentid().contains(userId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student is already enrolled in this class.");
            }

            classObj.getStudentid().add(userId);
            classRepository.save(classObj);

            Optional<Student> studentOptional = studentRepository.findByUserid(userId);
            if (studentOptional.isPresent()) {
                Student student = studentOptional.get();

                if (student.getClassid() == null) {
                    student.setClassid(new ArrayList<>());
                }

                student.getClassid().add(classObj.getClassid());
                studentRepository.save(student);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found with userId: " + userId);
            }

            return ResponseEntity.ok("Student successfully added to class");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding student to class: " + e.getMessage());
        }
    }

    @GetMapping("/getclassesbyteacherid")
    public List<Class> getClassesByTeacherId(@RequestParam("teacherid") String teacherid) {
        return classesService.getClassesByTeacherId(teacherid);
    }

    @GetMapping("/checkclass")
    public boolean checkClass(@RequestParam("classname") String classname,
            @RequestParam("teacherid") String teacherid) {
        return classesService.checkClass(classname, teacherid);
    }

    @GetMapping("/getclassdetails")
    public ResponseEntity<List<Class>> getClassDetails(@RequestParam("classids") List<String> classIds) {
        List<Class> classes = classesService.getClassDetails(classIds);
        if (!classes.isEmpty()) {
            return ResponseEntity.ok(classes);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/name/edit")
    public ResponseEntity<String> editClassName(@RequestParam("classId") String classId,
            @RequestParam("classname") String classname) {
        Optional<Class> optionalClass = classesService.getClassById(classId);
        if (optionalClass.isPresent()) {
            Class userClass = optionalClass.get();
            userClass.setClassname(classname);
            classesService.saveClassData(userClass);
            return ResponseEntity.ok("Class name updated.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/student/delete")
    public ResponseEntity<String> deleteStudent(@RequestParam("classId") String classId,
            @RequestParam("studentId") String studentId) {
        // Remove Student from CLASS' studentId array.
        boolean isRemoveFromClass = classesService.removeStudentFromList(classId, studentId);
        // Remove classId and associated quizId from the class in STUDENT.
        // Remove STUDENTQUIZ for removed students using its studentId and quizId.
        List<Quiz> quizzes = classesService.getQuizzesByClassId(classId);
        List<String> classIds = quizzes
                .stream()
                .map(Quiz::getClassid)
                .toList();
        List<String> quizIds = quizzes
                .stream()
                .map(Quiz::getQuizid)
                .toList();
        boolean isDeductedFromItemAnalysis = classesService.deductItemAnalysisBeforeDeletion(quizIds, studentId);

        boolean isRemoveFromStudentQuizAndStudent = classesService.removeStudentAssociatedCollections(quizIds, classIds,
                studentId, classId);
        if (!(isRemoveFromClass && isDeductedFromItemAnalysis && isRemoveFromStudentQuizAndStudent)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok("Student deleted.");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteClass(@RequestParam("classId") String classId) {
        // Remove the class
        boolean isClassDeleted = classesService.deleteClassById(classId);
        if (!isClassDeleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found.");
        }
        return ResponseEntity.ok("Class deleted successfully.");
    }

    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalClassByTeacher(@RequestParam("teacherId") String teacherId) {
        User teacher = userRepository.findByUserid(teacherId);
        if (teacher == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(-1);
        }
        int totalClasses = classesService.getClassesByTeacherId(teacherId).size();
        return ResponseEntity.ok(totalClasses);
    }

    @GetMapping("/total/studentperclass")
    public ResponseEntity<List<ClassStudentCountDTO>> getTotalStudentPerClass(
            @RequestParam("teacherId") String teacherId) {
        List<Class> teacherClasses = classesService.getClassesByTeacherId(teacherId);

        if (teacherClasses == null || teacherClasses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<ClassStudentCountDTO> classStudentCounts = new ArrayList<>();

        for (Class teacherClass : teacherClasses) {
            String className = teacherClass.getClassname();
            int studentCount = 0;

            if (teacherClass.getStudentid() != null) {
                studentCount = teacherClass.getStudentid().size();
            }

            classStudentCounts.add(new ClassStudentCountDTO(className, studentCount));
        }

        return ResponseEntity.ok(classStudentCounts);
    }

    @GetMapping("/total/quizperclass")
    public ResponseEntity<Integer> getTotalQuizzes(@RequestParam String classId) {
        Class teacherClass = classesService.getClassById(classId).orElse(null);
        if (teacherClass == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(-1);
        }
        List<Quiz> quizzes = quizService.getQuizzesByClassId(classId);
        return ResponseEntity.ok(quizzes.size());
    }

    @GetMapping("/total/quiz")
    public ResponseEntity<Integer> getTotalQuizzesByTeacher(@RequestParam("teacherId") String teacherId) {
        List<Class> teacherClasses = classesService.getClassesByTeacherId(teacherId);
        if (teacherClasses == null || teacherClasses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(-1);
        }
        List<String> classIds = teacherClasses.stream()
                .map(Class::getClassid)
                .collect(Collectors.toList());

        List<Quiz> quizzes = quizService.getQuizzesByClassIds(classIds);

        return ResponseEntity.ok(quizzes.size());
    }

    @GetMapping("/total/students")
    public ResponseEntity<Integer> getTotalStudent(@RequestParam("teacherId") String teacherId) {
        List<Class> teacherClasses = classesService.getClassesByTeacherId(teacherId);

        if (teacherClasses == null || teacherClasses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(-1);
        }

        int totalStudents = 0;

        for (Class teacherClass : teacherClasses) {
            if (teacherClass.getStudentid() != null) {
                totalStudents += teacherClass.getStudentid().size();
            }
        }

        return ResponseEntity.ok(totalStudents);
    }

    @GetMapping("/getallactivitylogs")
    public ResponseEntity<List<ActivityLogDTO>> getAllActivityLogs(@RequestParam("teacherId") String teacherId) {
        // Fetch all classes associated with the teacher (Use efficient database
        // queries)
        List<Class> teacherClasses = classesService.getClassesByTeacherId(teacherId);
        if (teacherClasses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<String> classIds = teacherClasses.stream()
                .map(Class::getClassid)
                .collect(Collectors.toList());

        // Fetch all quizzes for these classes in a batch query (Optimize)
        List<Quiz> quizzes = quizService.getQuizzesByClassIds(classIds);
        if (quizzes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<String> quizIds = quizzes.stream()
                .map(Quiz::getQuizid)
                .collect(Collectors.toList());

        // Fetch all StudentQuiz entries for these quizzes in a batch query (Optimize)
        List<StudentQuiz> studentQuizzes = studentQuizService.getStudentQuizzesByQuizIds(quizIds);
        if (studentQuizzes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Fetch all related activity log IDs and fetch all activity logs at once
        List<String> activityLogIds = studentQuizzes.stream()
                .flatMap(studentQuiz -> studentQuiz.getActivityLogIds().stream())
                .distinct() // Ensure no duplicates in activity log IDs
                .collect(Collectors.toList());

        if (activityLogIds.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Use batch fetching for activity logs and sort them by timestamp
        List<ActivityLog> activityLogs = activityLogRepository.findByIdIn(activityLogIds,
                Sort.by(Sort.Order.desc("timestamp")));
        if (activityLogs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Use parallel streams for mapping to DTOs if the dataset is large
        List<ActivityLogDTO> response = activityLogs.parallelStream()
                .map(activityLog -> {
                    String action = formatActivityMessage(activityLog.getActivity());
                    String userName = getUserFullNameById(activityLog.getUserId());
                    return new ActivityLogDTO(activityLog.getId(),
                            activityLog.getTimestamp().toString(),
                            action, userName);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private String formatActivityMessage(ActivityLog.Activity activity) {
        switch (activity) {
            case EDIT:
                return "The quiz has been edited.";
            case APPROVE:
                return "An item in the quiz has been approved.";
            case DISAPPROVE:
                return "An item in the quiz has been disapproved.";
            case UPLOAD:
                return "A quiz has been uploaded.";
            case BONUS:
                return "A bonus score has been added.";
            case SCORED:
                return "The quiz has been scored.";
            case MARKEDCORRECT:
                return "An item has been marked as correct.";
            case MARKEDWRONG:
                return "An item has been marked as incorrect.";
            default:
                return "An action has been performed.";
        }
    }

    private String getUserFullNameById(String userId) {
        User user = userService.getUserById(userId);
        return user != null ? user.getFirstname() + " " + user.getLastname() : "Unknown User";
    }

    @GetMapping("/getquizresultperclass")
    public ResponseEntity<Map<String, Object>> getQuizResultsPerClass(@RequestParam("teacherId") String teacherId) {
        // Fetch all classes associated with the teacher in a single query
        List<Class> teacherClasses = classesService.getClassesByTeacherId(teacherId);
        if (teacherClasses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Prepare the map to store class quiz results
        Map<String, Object> classQuizResults = new HashMap<>();

        // Fetch all quizzes for all teacher classes at once to minimize database hits
        List<String> classIds = teacherClasses.stream()
                .map(Class::getClassid)
                .collect(Collectors.toList());

        // Use batch query to get all quizzes for the class IDs in one call
        List<Quiz> quizzes = quizService.getQuizzesByClassIds(classIds);

        // Batch fetch all student quiz results for the quizzes
        List<String> quizIds = quizzes.stream().map(Quiz::getQuizid).collect(Collectors.toList());
        List<StudentQuiz> studentQuizzes = studentQuizRepository.findByQuizidIn(quizIds);

        // Collect all student IDs to fetch users in batch
        List<String> studentIds = studentQuizzes.stream()
                .map(StudentQuiz::getStudentid)
                .distinct()
                .collect(Collectors.toList());

        // Batch fetch all users (students) at once
        Map<String, User> userMap = userRepository.findAllById(studentIds)
                .stream()
                .collect(Collectors.toMap(User::getUserid, user -> user));

        // Process the quizzes and student quiz results
        for (Class teacherClass : teacherClasses) {
            List<QuizResultDTO> quizResults = quizzes.stream()
                    .filter(quiz -> quiz.getClassid().equals(teacherClass.getClassid()))
                    .map(quiz -> {
                        List<StudentQuiz> relevantStudentQuizzes = studentQuizzes.stream()
                                .filter(studentQuiz -> studentQuiz.getQuizid().equals(quiz.getQuizid()))
                                .collect(Collectors.toList());

                        // Use AtomicInteger to allow modification in lambda
                        AtomicInteger passCount = new AtomicInteger(0);
                        AtomicInteger failCount = new AtomicInteger(0);
                        AtomicInteger nearPerfectCount = new AtomicInteger(0);

                        List<QuizResultDTO.StudentScoreDTO> scores = relevantStudentQuizzes.stream()
                                .map(studentQuiz -> {
                                    User student = userMap.get(studentQuiz.getStudentid());
                                    if (student != null) {
                                        double percentage = quiz.getTotalitems() > 0
                                                ? (double) studentQuiz.getScore() / quiz.getTotalitems()
                                                : 0;

                                        String formattedPercentage = String.format("%.4f", percentage);
                                        double percentageRounded = Double.parseDouble(formattedPercentage);

                                        // Increment counts using AtomicInteger
                                        if (percentage >= 0.90)
                                            nearPerfectCount.incrementAndGet();
                                        else if (percentage >= 0.60)
                                            passCount.incrementAndGet();
                                        else
                                            failCount.incrementAndGet();

                                        QuizResultDTO.StudentScoreDTO scoreDTO = new QuizResultDTO.StudentScoreDTO();
                                        scoreDTO.setStudentName(student.getFirstname() + " " + student.getLastname());
                                        scoreDTO.setScore(studentQuiz.getScore());
                                        scoreDTO.setPercentage(percentageRounded);

                                        return scoreDTO;
                                    }
                                    return null;
                                })
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());

                        QuizResultDTO quizResultDTO = new QuizResultDTO();
                        quizResultDTO.setQuizName(quiz.getQuizname());
                        quizResultDTO.setTotalItems(quiz.getTotalitems());
                        quizResultDTO.setScores(scores);
                        quizResultDTO.setPassCount(passCount.get());
                        quizResultDTO.setFailCount(failCount.get());
                        quizResultDTO.setNearPerfectCount(nearPerfectCount.get());

                        return quizResultDTO;
                    })
                    .collect(Collectors.toList());

            classQuizResults.put(teacherClass.getClassname(), quizResults);
        }

        return ResponseEntity.ok(classQuizResults);
    }

    @PutMapping("/deactivate")
    public ResponseEntity<String> deactivateClass(@RequestParam("classId") String classId) {
        Optional<Class> optionalClass = classesService.getClassById(classId);
        if (optionalClass.isPresent()) {
            Class userClass = optionalClass.get();
            userClass.setIsactive(0);
            classesService.saveClassData(userClass);
            return ResponseEntity.ok("Class deactivated.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/activate")
    public ResponseEntity<String> activateClass(@RequestParam("classId") String classId) {
        Optional<Class> optionalClass = classesService.getClassById(classId);
        if (optionalClass.isPresent()) {
            Class userClass = optionalClass.get();
            userClass.setIsactive(1);
            classesService.saveClassData(userClass);
            return ResponseEntity.ok("Class activated.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
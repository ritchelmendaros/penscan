package com.softeng.penscan.service;

import com.softeng.penscan.model.Class;
import com.softeng.penscan.model.ItemAnalysis;
import com.softeng.penscan.model.Quiz;
import com.softeng.penscan.model.Student;
import com.softeng.penscan.model.StudentQuiz;
import com.softeng.penscan.model.StudentQuiz.RecognizedAnswer;
import com.softeng.penscan.repository.ClassRepository;
import com.softeng.penscan.repository.ItemAnalysisRepository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.softeng.penscan.repository.QuizRepository;
import com.softeng.penscan.repository.StudentQuizRepository;
import com.softeng.penscan.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private StudentQuizRepository studentQuizRepository;
    @Autowired
    private ItemAnalysisRepository itemAnalysisRepository;

    public Class addClass(Class classes) {
        String uniqueClassCode = generateUniqueClassCode();
        classes.setClassCode(uniqueClassCode);

        return classRepository.save(classes);
    }

    private String generateUniqueClassCode() {
        String classCode;
        boolean isUnique;

        do {
            classCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            isUnique = !classRepository.existsByClassCode(classCode);
        } while (!isUnique);

        return classCode;
    }

    public Class addStudentToClass(String userId, String classCode) {
        Optional<Class> classOptional = classRepository.findByClassCode(classCode);

        if (classOptional.isEmpty()) {
            throw new IllegalArgumentException("Class with the provided class code does not exist.");
        }

        Class classes = classOptional.get();

        if (classes.getStudentid() == null) {
            classes.setStudentid(new ArrayList<>());
        }

        if (classes.getStudentid().contains(userId)) {
            throw new IllegalArgumentException("Student is already in this class.");
        }

        classes.getStudentid().add(userId);

        return classRepository.save(classes);
    }

    public List<Class> getClassesByTeacherId(String teacherid) {
        return classRepository.findAllByTeacherid(teacherid);
    }

    public boolean checkClass(String classname, String teacherid) {
        return classRepository.existsByClassnameAndTeacherid(classname, teacherid);
    }

    public List<Class> getClassDetails(List<String> classids) {
        return classRepository.findAllById(classids);
    }

    public Optional<Class> getClassById(String classId) {
        return classRepository.findClassByClassid(classId);
    }

    public void saveClassData(Class userClass) {
        classRepository.save(userClass);
    }

    public boolean removeStudentFromList(String classId, String studentId) {
        Optional<Class> userClass = classRepository.findById(classId);
        if (userClass.isPresent()) {
            Class aClass = userClass.get();
            boolean removed = aClass.getStudentid().remove(studentId);
            if (removed) {
                classRepository.save(aClass);
            }
            return removed;
        }
        return false;
    }

    public List<Quiz> getQuizzesByClassId(String classId) {
        return quizRepository.findByClassid(classId);
    }

    // public boolean removeStudentAssociatedCollections(List<String> quizIds,
    // List<String> classIds, String studentId) {
    // Optional<Student> student = studentRepository.findByUserid(studentId);

    // if (student.isEmpty())
    // return false;

    // Student currentStudent = student.get();
    // currentStudent.getClassid().removeIf(classIds::contains);
    // Iterator<String> quizIdIterator = currentStudent.getQuizid().iterator();
    // while (quizIdIterator.hasNext()) {
    // String quizId = quizIdIterator.next();
    // if (quizIds.contains(quizId)) {
    // quizIdIterator.remove();
    // studentQuizRepository.deleteAllByStudentidAndQuizid(studentId, quizId);
    // }
    // }
    // studentRepository.save(currentStudent);
    // return true;
    // }
    public boolean removeStudentAssociatedCollections(List<String> quizIds, List<String> classIds, String studentId,
            String classId) {
        Optional<Student> student = studentRepository.findByUserid(studentId);

        if (student.isEmpty())
            return false;

        Student currentStudent = student.get();
        currentStudent.getClassid().removeIf(classIds::contains);
        currentStudent.getClassid().removeIf(classId::contains);
        Iterator<String> quizIdIterator = currentStudent.getQuizid().iterator();
        while (quizIdIterator.hasNext()) {
            String quizId = quizIdIterator.next();
            if (quizIds.contains(quizId)) {
                quizIdIterator.remove();
                studentQuizRepository.deleteAllByStudentidAndQuizid(studentId, quizId);
            }
        }
        studentRepository.save(currentStudent);
        return true;
    }

    public boolean deductItemAnalysisBeforeDeletion(List<String> quizIds, String studentId) {
        // Find all StudentQuiz entries for the given studentId and quizIds
        List<StudentQuiz> studentQuizzes = studentQuizRepository.findAllByStudentidAndQuizidIn(studentId, quizIds);

        // Iterate through each StudentQuiz to deduct counts in ItemAnalysis
        for (StudentQuiz studentQuiz : studentQuizzes) {
            List<RecognizedAnswer> recognizedAnswers = studentQuiz.getRecognizedAnswers();

            for (RecognizedAnswer recognizedAnswer : recognizedAnswers) {
                int itemNumber = recognizedAnswer.getItemnumber();
                boolean isCorrect = recognizedAnswer.isCorrect();

                // Update the corresponding ItemAnalysis
                Optional<ItemAnalysis> itemAnalysisOpt = itemAnalysisRepository
                        .findByQuizidAndItemNumber(studentQuiz.getQuizid(), itemNumber);
                if (itemAnalysisOpt.isPresent()) {
                    ItemAnalysis itemAnalysis = itemAnalysisOpt.get();
                    if (isCorrect) {
                        itemAnalysis.decrementCorrectCount();
                    } else {
                        itemAnalysis.decrementIncorrectCount();
                    }
                    itemAnalysisRepository.save(itemAnalysis);
                }
            }
        }

        return true;
    }

    public boolean deleteClassById(String classId) {
        // First, find the class by ID
        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isPresent()) {
            // Delete all quizzes associated with this class ID
            List<Quiz> quizzes = quizRepository.findByClassid(classId);
            quizRepository.deleteAll(quizzes); // Remove quizzes

            // Remove the class ID from all students
            List<Student> students = studentRepository.findAll();
            for (Student student : students) {
                student.getClassid().remove(classId);
                studentRepository.save(student);
            }

            classRepository.delete(optionalClass.get());
            return true;
        }
        return false;
    }

    public List<StudentQuiz> getStudentQuizzesByQuizIds(List<String> quizIds) {
        return studentQuizRepository.findByQuizidIn(quizIds);
    }

}

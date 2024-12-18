package com.softeng.penscan.service;

import com.softeng.penscan.model.StudentQuiz;
import com.softeng.penscan.model.ActivityLog;
import com.softeng.penscan.repository.ActivityLogRepository;
import com.softeng.penscan.repository.StudentQuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public List<ActivityLog> getActivityLogsByQuizId(String quizId) {
        List<StudentQuiz> studentQuizzes = studentQuizRepository.findByQuizid(quizId);
        List<String> activityLogIds = new ArrayList<>();

        for (StudentQuiz studentQuiz : studentQuizzes) {
            activityLogIds.addAll(studentQuiz.getActivityLogIds());
        }
        return activityLogRepository.findByIdIn(activityLogIds);
    }
}

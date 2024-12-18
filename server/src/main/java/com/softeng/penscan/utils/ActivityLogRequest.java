package com.softeng.penscan.utils;

import com.softeng.penscan.model.ActivityLog;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivityLogRequest {
    private String userId;
    private String studentQuizId;
    private ActivityLog.Activity activity;
}

package com.softeng.penscan.utils;

public class ActivityLogDTO {
    private String id;
    private String timestamp;
    private String activity;
    private String userName;

    public ActivityLogDTO(String id, String timestamp, String activity, String userName) {
        this.id = id;
        this.timestamp = timestamp;
        this.activity = activity;
        this.userName = userName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}

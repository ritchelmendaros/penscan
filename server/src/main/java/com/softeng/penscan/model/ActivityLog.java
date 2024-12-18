package com.softeng.penscan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Document(collection = "ActivityLog")
public class ActivityLog {
    private String id;
    private LocalDateTime timestamp;
    private Activity activity;
    private String userId;

    public static ActivityLog create(String actor, Activity activity) {
        return new ActivityLog(null,
                ZonedDateTime.now(ZoneId.of("UTC+8")).toLocalDateTime(),
                activity, actor);
    }

    public String getLogEntry(String name) {
        DateTimeFormatter dateformat = DateTimeFormatter.ofPattern("MMMM dd, yyyy | hh:mm a");
        String timestampFormat = timestamp.format(dateformat);

        String action = "";
        switch (activity) {
            case EDIT:
                action = "edited the quiz";
                break;
            case APPROVE:
                action = "approved an item in the quiz";
                break;
            case DISAPPROVE:
                action = "disapproved an item in the quiz";
                break;
            case UPLOAD:
                action = "uploaded a quiz";
                break;
            case BONUS:
                action = "added a bonus score";
                break;
            case SCORED:
                action = "scored the quiz";
                break;
            case MARKEDCORRECT:
                action = "marked an item correct";
                break;
            case MARKEDWRONG:
                action = "marked an item wrong";
                break;
            default:
                action = "performed an action";
                break;
        }

        return name + " " + action + " on " + timestampFormat;
    }

    public enum Activity {
        EDIT,
        APPROVE,
        DISAPPROVE,
        UPLOAD,
        BONUS,
        SCORED,
        MARKEDCORRECT,
        MARKEDWRONG
    }
}

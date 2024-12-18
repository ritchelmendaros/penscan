package com.softeng.penscan.repository;

import com.softeng.penscan.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Set;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByIdIn(List<String> ids);

    void deleteByIdIn(List<String> ids);

    List<ActivityLog> findByIdIn(List<String> activityLogIds, Sort sort);

    List<ActivityLog> findByIdIn(Set<String> ids);
}

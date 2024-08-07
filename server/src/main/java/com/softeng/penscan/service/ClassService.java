package com.softeng.penscan.service;

import com.softeng.penscan.model.Class;
import com.softeng.penscan.repository.ClassRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    public Class addClass(Class classes) {
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

}

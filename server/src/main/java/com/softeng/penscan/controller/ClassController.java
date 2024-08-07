package com.softeng.penscan.controller;

import com.softeng.penscan.model.Class;
import com.softeng.penscan.service.ClassService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classesService;

    @PostMapping("/add")
    public Class addClass(@RequestBody Class classes) {
        return classesService.addClass(classes);
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

}

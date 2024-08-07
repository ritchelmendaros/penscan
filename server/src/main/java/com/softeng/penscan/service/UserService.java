package com.softeng.penscan.service;

import com.softeng.penscan.model.Student;
import com.softeng.penscan.model.Teacher;
import com.softeng.penscan.model.User;
import com.softeng.penscan.repository.StudentRepository;
import com.softeng.penscan.repository.TeacherRepository;
import com.softeng.penscan.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
            TeacherRepository teacherRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
    }

    public boolean registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return false;
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        User savedUser = userRepository.save(user);

        if (savedUser.getUserType().equalsIgnoreCase("teacher")) {
            Teacher teacher = new Teacher();
            teacher.setUserid(savedUser.getUserid());
            teacherRepository.save(teacher);
        } else if (savedUser.getUserType().equalsIgnoreCase("student")) {
            Student student = new Student();
            student.setUserid(savedUser.getUserid());
            student.setClassid(null);
            student.setQuizid(null);
            studentRepository.save(student);
        }

        return true;
    }

    public boolean loginUser(String username, String password) {
        User user = (User) userRepository.findByUsername(username);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(password, user.getPassword());
    }

    public User getUserByUsername(String username) {
        return (User) userRepository.findByUsername(username);
    }

    public String getUserTypeByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if (user != null) {
            return user.getUserType();
        } else {
            return null;
        }
    }

    public List<User> getUsersByType(String userType) {
        return userRepository.findByUserType(userType);
    }

    public Object getUserDetailsByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean updateUserDetails(String username, String firstName, String lastName) {
        Object userObj = userRepository.findByUsername(username);
        if (userObj != null && userObj instanceof User) {
            User user = (User) userObj;
            user.setFirstname(firstName);
            user.setLastname(lastName);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public User getUserDetailsByUserId(String userId) {
        return userRepository.findByUserid(userId);
    }
}

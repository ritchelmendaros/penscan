package com.softeng.penscan.model;

import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Document(collection = "User")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    @Id
    private String userid;
    @NonNull
    private String firstname;
    @NonNull
    private String lastname;
    @NonNull
    private String username;
    @NonNull
    private String password;
    @NonNull
    private String userType;

}

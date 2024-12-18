package com.softeng.penscan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.softeng.penscan")
public class PenscanApplication {

	public static void main(String[] args) {
		SpringApplication.run(PenscanApplication.class, args);
	}
}

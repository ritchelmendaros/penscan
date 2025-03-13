package com.softeng.penscan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.softeng.penscan")
public class PenscanApplication {

	private static boolean isLibraryLoaded = false;

	public static void main(String[] args) {
		if (!isLibraryLoaded) {
			String dllPath = System.getProperty("user.dir") + "//native//opencv_java4100.dll";
			System.load(dllPath);
			isLibraryLoaded = true;
			System.out.println("OpenCV Native Library Loaded Successfully!");
		}
		SpringApplication.run(PenscanApplication.class, args);
	}
}

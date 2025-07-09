package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

		String rawPassword = "admin123";  // Cambia aquí por la contraseña que quieras hashear
		String encodedPassword = passwordEncoder.encode(rawPassword);

		System.out.println("Texto plano: " + rawPassword);
		System.out.println("Hash BCrypt: " + encodedPassword);
	}

}

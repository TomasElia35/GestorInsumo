package com.example.demo.user.repository;

import com.example.demo.user.modelo.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByMail(String mail);
}

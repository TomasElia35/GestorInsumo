package com.example.demo.user.controller;

import com.example.demo.user.modelo.Rol;
import com.example.demo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/insumomanager-app/roles")
@CrossOrigin(value = "http://localhost:4200")
public class RolController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rol>> obtenerTodosLosRoles() {
        try {
            List<Rol> roles = userService.obtenerTodosLosRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
package com.example.demo.auth.service;

import com.example.demo.auth.dto.AuthRequest;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.auth.util.JwtUtil;
import com.example.demo.user.modelo.User;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse authenticate(AuthRequest authRequest) {
        // Buscar usuario por email
        User user = userRepository.findByMail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si el usuario está activo
        if (!user.getEstado()) {
            throw new RuntimeException("Usuario inactivo");
        }

        // Verificar contraseña
        if (!passwordEncoder.matches(authRequest.getContrasena(), user.getContrasena())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Generar token JWT
        String token = jwtUtil.generateToken(
                user.getMail(),
                user.getRol().getNombre(),
                user.getId()
        );

        // Crear respuesta
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getMail());
        response.setNombre(user.getNombre());
        response.setApellido(user.getApellido());
        response.setRol(user.getRol().getNombre());
        response.setUserId(user.getId());

        return response;
    }
}

package com.example.demo.user.service;


import com.example.demo.user.dto.UserRequestDTO;
import com.example.demo.user.dto.UserResponseDTO;
import com.example.demo.user.modelo.User;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    @Override
    public List<UserResponseDTO> listarUsuarios() {
        return List.of();
    }

    @Override
    public User buscarPorID(Integer idProducto) {
        return null;
    }

    @Override
    public User guardarUsuarioDesdeDTO(UserRequestDTO dto) {
        return null;
    }

    @Override
    public void eliminarUsuario(Integer idProducto) {

    }

    @Override
    public User actualizarUsuarioDesdeDTO(Integer id, UserRequestDTO dto) {
        return null;
    }
}

package com.example.demo.user.service;

import com.example.demo.user.dto.UserRequestDTO;
import com.example.demo.user.dto.UserResponseDTO;
import com.example.demo.user.modelo.Rol;
import com.example.demo.user.modelo.User;
import com.example.demo.user.repository.RolRepository;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponseDTO> listarUsuarios() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public User buscarPorID(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User guardarUsuarioDesdeDTO(UserRequestDTO dto) {
        User user = new User();
        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setMail(dto.getMail());
        user.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        user.setEstado(dto.getEstado());

        // Buscar y asignar el rol
        Rol rol = rolRepository.findById(dto.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        user.setRol(rol);

        return userRepository.save(user);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        userRepository.deleteById(id);
    }

    @Override
    public User actualizarUsuarioDesdeDTO(Integer id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setMail(dto.getMail());

        // Solo actualizar la contraseña si se proporciona una nueva
        if (dto.getContrasena() != null && !dto.getContrasena().isEmpty()) {
            user.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        }

        user.setEstado(dto.getEstado());

        // Buscar y asignar el rol
        Rol rol = rolRepository.findById(dto.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        user.setRol(rol);

        return userRepository.save(user);
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setMail(user.getMail());
        dto.setContrasena(user.getContrasena());
        dto.setEstado(user.getEstado());
        dto.setFechaCreacion(user.getFechaCreacion());

        // Convertir Rol
        if (user.getRol() != null) {
            UserResponseDTO.RolDTO rolDTO = new UserResponseDTO.RolDTO();
            rolDTO.setId(user.getRol().getId());
            rolDTO.setNombre(user.getRol().getNombre());
            dto.setRol(rolDTO);
        }

        return dto;
    }
}

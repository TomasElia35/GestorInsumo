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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
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

    // Nuevo método para obtener DTO por ID
    public UserResponseDTO obtenerUsuarioPorId(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        return user != null ? convertToResponseDTO(user) : null;
    }

    @Override
    public User guardarUsuarioDesdeDTO(UserRequestDTO dto) {
        // Validar que el email no exista
        if (userRepository.findByMail(dto.getMail()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }

        // Validar que el rol exista
        Rol rol = rolRepository.findById(dto.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Crear nuevo usuario
        User user = new User();
        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setMail(dto.getMail());
        user.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        user.setEstado(dto.getEstado() != null ? dto.getEstado() : true);
        user.setRol(rol);

        return userRepository.save(user);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        userRepository.deleteById(id);
    }

    @Override
    public User actualizarUsuarioDesdeDTO(Integer id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el email no esté siendo usado por otro usuario
        userRepository.findByMail(dto.getMail()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(id)) {
                throw new RuntimeException("Ya existe un usuario con ese email");
            }
        });

        // Actualizar campos
        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setMail(dto.getMail());

        // Solo actualizar la contraseña si se proporciona una nueva
        if (dto.getContrasena() != null && !dto.getContrasena().trim().isEmpty()) {
            user.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        }

        user.setEstado(dto.getEstado() != null ? dto.getEstado() : true);

        // Buscar y asignar el rol
        Rol rol = rolRepository.findById(dto.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        user.setRol(rol);

        return userRepository.save(user);
    }

    // Nuevo método para cambiar solo el estado
    public User cambiarEstadoUsuario(Integer id, Boolean nuevoEstado) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setEstado(nuevoEstado);
        return userRepository.save(user);
    }

    // Método para obtener todos los roles (útil para el frontend)
    public List<Rol> obtenerTodosLosRoles() {
        return rolRepository.findAll();
    }

    // Método público para convertir a DTO (usado en el controller)
    public UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setMail(user.getMail());
        dto.setContrasena(user.getContrasena()); // Considerar si realmente necesitas devolver la contraseña
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

    // Método para buscar usuarios por email (útil para validaciones)
    public User buscarPorEmail(String email) {
        return userRepository.findByMail(email).orElse(null);
    }

    // Método para contar usuarios activos
    public long contarUsuariosActivos() {
        return userRepository.findAll().stream()
                .filter(User::getEstado)
                .count();
    }
}

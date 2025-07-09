package com.example.demo.user.service;

import com.example.demo.user.dto.UserRequestDTO;
import com.example.demo.user.dto.UserResponseDTO;
import com.example.demo.user.modelo.Rol;
import com.example.demo.user.modelo.User;

import java.util.List;

public interface IUserService {
    // Operaciones CRUD básicas
    List<UserResponseDTO> listarUsuarios();
    User buscarPorID(Integer id);
    User guardarUsuarioDesdeDTO(UserRequestDTO dto);
    void eliminarUsuario(Integer id);
    User actualizarUsuarioDesdeDTO(Integer id, UserRequestDTO dto);

    // Operaciones adicionales
    UserResponseDTO obtenerUsuarioPorId(Integer id);
    User cambiarEstadoUsuario(Integer id, Boolean nuevoEstado);
    List<Rol> obtenerTodosLosRoles();
    UserResponseDTO convertToResponseDTO(User user);
    User buscarPorEmail(String email);
    long contarUsuariosActivos();
}

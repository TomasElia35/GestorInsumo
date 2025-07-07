package com.example.demo.user.service;

import com.example.demo.user.dto.UserRequestDTO;
import com.example.demo.user.dto.UserResponseDTO;
import com.example.demo.user.modelo.User;

import java.util.List;

public interface IUserService {
    List<UserResponseDTO> listarUsuarios();
    User buscarPorID(Integer idProducto);
    User guardarUsuarioDesdeDTO(UserRequestDTO dto);
    void eliminarUsuario(Integer idProducto);
    User actualizarUsuarioDesdeDTO(Integer id, UserRequestDTO dto);
}

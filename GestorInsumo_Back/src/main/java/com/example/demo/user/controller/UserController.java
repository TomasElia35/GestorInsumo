package com.example.demo.user.controller;

import com.example.demo.user.dto.UserRequestDTO;
import com.example.demo.user.dto.UserResponseDTO;
import com.example.demo.user.modelo.User;
import com.example.demo.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/insumomanager-app")
@CrossOrigin(value = "http://localhost:4200")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService usuarioServicio;

    // GET - Obtener todos los usuarios
    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> obtenerUsuarios() {
        try {
            List<UserResponseDTO> usuarios = this.usuarioServicio.listarUsuarios();
            usuarios.forEach(usuario -> logger.info("Usuario DTO: {}", usuario));
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            logger.error("Error al obtener usuarios: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET - Obtener usuario por ID
    @GetMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> obtenerUsuarioPorId(@PathVariable Integer id) {
        try {
            UserResponseDTO usuario = this.usuarioServicio.obtenerUsuarioPorId(id);
            if (usuario != null) {
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al obtener usuario por ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST - Crear nuevo usuario
    @PostMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> agregarUsuario(@Valid @RequestBody UserRequestDTO dto) {
        try {
            logger.info("Usuario DTO recibido: {}", dto);
            User nuevoUsuario = this.usuarioServicio.guardarUsuarioDesdeDTO(dto);

            // Convertir a DTO de respuesta
            UserResponseDTO response = this.usuarioServicio.convertToResponseDTO(nuevoUsuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            logger.error("Error al crear usuario: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error interno al crear usuario: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // PUT - Actualizar usuario
    @PutMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarUsuario(
            @PathVariable Integer id,
            @Valid @RequestBody UserRequestDTO dto) {
        try {
            logger.info("Actualizando usuario con ID {}: {}", id, dto);
            User actualizado = this.usuarioServicio.actualizarUsuarioDesdeDTO(id, dto);

            // Convertir a DTO de respuesta
            UserResponseDTO response = this.usuarioServicio.convertToResponseDTO(actualizado);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error al actualizar usuario: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error interno al actualizar usuario: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // DELETE - Eliminar usuario (soft delete)
    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> eliminarUsuario(@PathVariable Integer id) {
        try {
            User usuario = this.usuarioServicio.buscarPorID(id);
            if (usuario == null) {
                logger.warn("No se encontró el usuario con ID: {}", id);
                Map<String, Object> response = new HashMap<>();
                response.put("eliminado", false);
                response.put("mensaje", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            this.usuarioServicio.eliminarUsuario(id);
            logger.info("Usuario con ID {} eliminado correctamente", id);

            Map<String, Object> response = new HashMap<>();
            response.put("eliminado", true);
            response.put("mensaje", "Usuario eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al eliminar usuario con ID {}: {}", id, e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("eliminado", false);
            response.put("mensaje", "Error al eliminar usuario");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // PATCH - Cambiar estado del usuario (activar/desactivar)
    @PatchMapping("/usuarios/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable Integer id, @RequestBody Map<String, Boolean> estadoRequest) {
        try {
            Boolean nuevoEstado = estadoRequest.get("estado");
            if (nuevoEstado == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "El campo 'estado' es requerido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            User usuario = this.usuarioServicio.cambiarEstadoUsuario(id, nuevoEstado);
            UserResponseDTO response = this.usuarioServicio.convertToResponseDTO(usuario);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error al cambiar estado del usuario: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            logger.error("Error interno al cambiar estado del usuario: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}


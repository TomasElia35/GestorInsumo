package com.example.demo.user.controller;


import com.example.demo.user.dto.UserRequestDTO;
import com.example.demo.user.dto.UserResponseDTO;
import com.example.demo.user.modelo.User;
import com.example.demo.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("insumomanager-app") //http://localhost:8080/insumomanager-app
@CrossOrigin(value = "http://localhost:4200")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService usuarioServicio;


    @GetMapping("/usuarios") //http://localhost:8080/insumomanager-app/usuarios
    public List<UserResponseDTO> obtenerUsuarios(){
        List<UserResponseDTO> usuarios = this.usuarioServicio.listarUsuarios();
        usuarios.forEach(usuario -> logger.info("Usuario DTO: {}", usuario));
        return usuarios;
    }

    @PostMapping("/usuarios")
    public User agregarUsuario(@RequestBody UserRequestDTO dto){
        logger.info("Usuario DTO recibido: {}", dto);
        return this.usuarioServicio.guardarUsuarioDesdeDTO(dto);
    }


    @PutMapping("/usuarios/{id}")
    public ResponseEntity<User> actualizarUsuario(
            @PathVariable Integer id,
            @RequestBody UserRequestDTO dto) {
        logger.info("Actualizando usuario con ID {}: {}", id, dto);
        User actualizado = this.usuarioServicio.actualizarUsuarioDesdeDTO(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarUsuario(@PathVariable int id) {
        User usuario = this.usuarioServicio.buscarPorID(id);
        if (usuario == null) {
            System.out.println("No se encontro el Id: " + id);
        }

        this.usuarioServicio.eliminarUsuario(id);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("eliminado", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

}


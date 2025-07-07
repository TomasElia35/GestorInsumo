package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Integer id;
    private String nombre;
    private String apellido;
    private String mail;
    private String contrasena;
    private Boolean estado;
    private LocalDate fechaCreacion;
    private RolDTO rol;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RolDTO {
        private Integer id;
        private String nombre;
    }
}

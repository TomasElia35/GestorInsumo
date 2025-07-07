package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {
    private String nombre;
    private String apellido;
    private String mail;
    private String contrasena;
    private Boolean estado=true;
    private Integer rol;
}
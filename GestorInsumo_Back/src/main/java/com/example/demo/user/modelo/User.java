package com.example.demo.user.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USUARIO") // Debe coincidir con la tabla en la BD
public class User {
    @Id
    @Column(name = "idUsuario")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idRol")
    private Rol rol;

    @Column(name = "email")
    private String mail;

    @Column(name = "clave")
    @JsonProperty("contrasena")
    private String contrasena;

    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;

    @Column(name = "activo")
    private Boolean estado;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDate.now();
        }
    }
}

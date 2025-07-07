CREATE DATABASE gestorInsumo;

USE gestorInsumo;

CREATE TABLE ROL (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE USUARIO (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, -- Agregu茅 UNIQUE
    clave VARCHAR(255) NOT NULL, -- Aument茅 a 255 para BCrypt
    idRol INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT NULL,
    
    FOREIGN KEY (idRol) REFERENCES ROL(idRol),
    FOREIGN KEY (creado_por) REFERENCES USUARIO(idUsuario)
);

SELECT * FROM ROL;

SELECT * FROM USUARIO;
INSERT INTO USUARIO(nombre,apellido,email,clave,idRol)values('Administrador','Generico','root@gmail.com','root2024',1);

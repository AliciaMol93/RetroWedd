<?php

require 'db.php';
$conn->set_charset("utf8mb4"); // por si usas emojis o acentos
$conn->query("SET FOREIGN_KEY_CHECKS=1");

$sql_queries = [
    // Tabla Menus (debe crearse primero por las relaciones)
    "CREATE TABLE IF NOT EXISTS menus(
        menu_id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_menu VARCHAR(50) NOT NULL COMMENT 'Vegano, Vegetariano, Clásico, Embarazada'
    )",
    
    // Tabla Alergenos
    "CREATE TABLE IF NOT EXISTS alergenos(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_alergeno VARCHAR(500) NOT NULL COMMENT 'Gluten, Frutos secos, Lactosa, etc.'
    )",
    
    // Tabla invitados
    "CREATE TABLE IF NOT EXISTS invitados(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_inv VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100),
    email VARCHAR(100),
    asistencia BOOLEAN DEFAULT NULL COMMENT 'NULL=no respondió, TRUE=asiste, FALSE=no asiste',
    transporte BOOLEAN DEFAULT FALSE,
    num_ninos INT DEFAULT 0,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE SET NULL
    )",
    
    // Tabla invitado_alergenos
    "CREATE TABLE IF NOT EXISTS invitado_alergenos (
        invitado_id INT NOT NULL,
        alergeno_id INT NOT NULL,
        PRIMARY KEY (invitado_id, alergeno_id),
        FOREIGN KEY (invitado_id) REFERENCES invitados(id) ON DELETE CASCADE,
        FOREIGN KEY (alergeno_id) REFERENCES alergenos(id) ON DELETE CASCADE
    )",
    // Tabla sugerencias canciones
    "CREATE TABLE IF NOT EXISTS sugerencias_canciones (
        cancion_id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_cancion VARCHAR(255) NOT NULL,
        artista VARCHAR(255),
        invitado_id INT,
        FOREIGN KEY (invitado_id) REFERENCES invitados(id) ON DELETE CASCADE
        
    )"
];

// Ejecutar las consultas
foreach ($sql_queries as $sql) {
    if ($conn->query($sql) === TRUE) {
        echo "Tabla creada correctamente<br>";
    } else {
        // Mostrar el error si falla
        echo "Error al crear la tabla: " . $conn->error . "<br>";
    }
}


// Cerrar la conexión
$conn->close();
?>

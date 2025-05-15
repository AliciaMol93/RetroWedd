<?php

$servidor = "localhost";
$usuario = "RetroWedd";
$clave = "RetroWedding123";
$base_de_datos = "RetroWedd";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $clave, $base_de_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die("La conexión ha fallado: " . $conn->connect_error);
}

// No pongas ningún echo aquí, solo si es necesario para el desarrollo puedes usar `error_log`
// error_log("Conexión exitosa");
?>

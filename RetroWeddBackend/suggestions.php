<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'db.php'; //conexión a la db

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

try {
    /**
     * Procesa una solicitud GET para obtener sugerencias de canciones.
     *
     * Espera el parámetro 'action=getSuggestions'.
     * Devuelve un JSON con las sugerencias y datos del invitado.
     */
    if ($method === 'GET') {
        $action = $_GET['action'] ?? null;

        if ($action === 'getSuggestions') {
            $result = $conn->query("SELECT s.nombre_cancion, s.artista, i.nombre_inv, i.apellidos 
                                FROM sugerencias_canciones s
                                JOIN invitados i ON s.invitado_id = i.id");

            $sugerencias = [];
            while ($row = $result->fetch_assoc()) {
                $sugerencias[] = $row;
            }

            echo json_encode($sugerencias);
            exit;
        }
    }
    /**
     * Procesa una solicitud POST para agregar sugerencias de canciones.
     *
     * Espera el parámetro 'action=addSongSuggestion'.
     * El cuerpo debe contener un objeto JSON con:
     * - invitado_id
     * - sugerencias: arreglo de canciones con nombre y artista
     */
    if ($method === 'POST') {
        // Verifica si la acción es 'addSongSuggestion'
        $action = $_GET['action'] ?? null;

        if ($action === 'addSongSuggestion') {
            $data = json_decode(file_get_contents("php://input"), true);

            if (empty($data['invitado'])) {
                http_response_code(400);
                echo json_encode(["error" => "Datos incompletos"]);
                exit;
            }

            // Extraemos el id del invitado
            $invitado_id = $data['invitado']['invitado_id'] ?? null;

            // Verifica que el id del invitado sea válido
            if (!$invitado_id) {
                http_response_code(400);
                echo json_encode(["error" => "ID de invitado no válido"]);
                exit;
            }

            // Procesamos las sugerencias de canciones
            $sugerencias = $data['invitado']['sugerencias'] ?? [];

            // Itera y guarda cada sugerencia si tiene datos válidos
            foreach ($sugerencias as $sugerencia) {
                $nombreCancion = trim($sugerencia['nombre_cancion'] ?? '');
                $artista = trim($sugerencia['artista'] ?? '');

                if ($nombreCancion !== '' && $artista !== '') {
                    // Insertar la sugerencia en la base de datos
                    $stmt = $conn->prepare("INSERT INTO sugerencias_canciones (nombre_cancion, artista, invitado_id)"
                            . " VALUES (?, ?, ?)");
                    $stmt->bind_param("ssi", $nombreCancion, $artista, $invitado_id);

                    if (!$stmt->execute()) {
                        throw new Exception("Error al insertar sugerencia de canción: " . $stmt->error);
                    }
                    $stmt->close();
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Nombre de la canción o el artista están vacíos"]);
                    exit;
                }
            }

            echo json_encode(["success" => true, "message" => "Sugerencias guardadas correctamente"]);
            exit;
        }
    }

    // Método no permitido
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    
} catch (Exception $e) {
    // Error inesperado en servidor
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
} finally {
    // Cerrar conexión
    $conn->close();
}

<?php

// Configuración para pruebas
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Función para capturar la salida
function capture_output($callback) {
    $level = ob_get_level();
    ob_start();
    try {
        $callback();
        return ob_get_clean();
    } catch (Exception $e) {
        while (ob_get_level() > $level) {
            ob_end_clean();
        }
        throw $e;
    }
}

// Función para simular una petición HTTP
function simulate_request($method, $action, $params = [], $input = null) {
    // Resetear las variables globales
    $_SERVER = [];
    $_GET = [];
    $_POST = [];
    $_FILES = [];
    
    // Configurar la petición
    $_SERVER['REQUEST_METHOD'] = $method;
    $_GET['action'] = $action;
    $_GET = array_merge($_GET, $params);
    
    if ($input !== null) {
        file_put_contents('php://input', json_encode($input));
    }
}

// Incluir archivos necesarios
require_once __DIR__ . '/../vendor/autoload.php';

// Mock de la conexión a la base de datos
$GLOBALS['conn'] = null;

// Definir funciones de la API si no existen
if (!function_exists('getMenus')) {
    // Definir funciones de la API sin ejecutar el código principal
    function getMenus($conn) {
        $query = "SELECT menu_id, nombre_menu FROM menus";
        $result = $conn->query($query);
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }

    function getAlergenos($conn) {
        $query = "SELECT id, nombre_alergeno FROM alergenos";
        $result = $conn->query($query);
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    }

    function getAsistencia($conn, $email) {
        $stmt = $conn->prepare("SELECT asistencia FROM invitados WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        echo json_encode(["asistencia" => (bool) $row['asistencia']]);
    }
}

if (!function_exists('getSuggestions')) {
    // Definir funciones de sugerencias sin ejecutar el código principal
    function getSuggestions($conn) {
        $query = "SELECT s.nombre_cancion, s.artista, i.nombre_inv, i.apellidos FROM sugerencias_canciones s JOIN invitados i ON s.invitado_id = i.id";
        $result = $conn->query($query);
        $sugerencias = [];
        while ($row = $result->fetch_assoc()) {
            $sugerencias[] = $row;
        }
        echo json_encode($sugerencias);
    }

    function addSongSuggestion($conn, $data) {
        if (empty($data['invitado']) || empty($data['invitado']['invitado_id']) || empty($data['invitado']['sugerencias'])) {
            echo json_encode(["error" => "Datos incompletos"]);
            return;
        }

        $invitado_id = $data['invitado']['invitado_id'];
        $sugerencias = $data['invitado']['sugerencias'];

        foreach ($sugerencias as $sugerencia) {
            $stmt = $conn->prepare("INSERT INTO sugerencias_canciones (nombre_cancion, artista, invitado_id) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $sugerencia['nombre_cancion'], $sugerencia['artista'], $invitado_id);
            $stmt->execute();
            $stmt->close();
        }

        echo json_encode(["success" => true, "message" => "Sugerencias guardadas correctamente"]);
    }
} 
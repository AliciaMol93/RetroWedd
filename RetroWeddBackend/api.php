<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cabeceras para CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'db.php'; // Conexión a la base de datos

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

/**
 * Obtiene la lista de menús desde la base de datos.
 *
 * @param mysqli $conn Conexión a la base de datos
 * @return void
 */
function getMenus($conn) {
    $query = "SELECT menu_id, nombre_menu FROM menus";
    $result = $conn->query($query);
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
}

/**
 * Obtiene la lista de alérgenos.
 *
 * @param mysqli $conn Conexión a la base de datos
 * @return void
 */
function getAlergenos($conn) {
    $query = "SELECT id, nombre_alergeno FROM alergenos";
    $result = $conn->query($query);
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
}

/**
 * Obtiene la confirmación de asistencia de un invitado según su email.
 *
 * @param mysqli $conn Conexión a la base de datos
 * @param string $email Email del invitado
 * @return void
 */
function getAsistencia($conn, $email) {
    $stmt = $conn->prepare("SELECT asistencia FROM invitados WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($asistencia);
    $stmt->fetch();
    $stmt->close();

    //Lo devolvemos en json
    echo json_encode(["asistencia" => (bool) $asistencia]);
    exit;
}

try {
     /**
     * Procesamiento de solicitudes GET:
     * - getMenus
     * - getAlergenos
     * - getAsistencia (requiere email)
     */
    if ($method === 'GET') {
        $action = $_GET['action'] ?? null;
        if ($action === 'getMenus') {
            getMenus($conn);
        } elseif ($action === 'getAlergenos') {
            getAlergenos($conn);
        } elseif ($action === 'getAsistencia' && isset($_GET['email'])) {
            getAsistencia($conn, $_GET['email']);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Acción no válida o parámetros faltantes"]);
        }
        exit;
    }

     /**
     * Procesamiento de solicitudes POST:
     * Inserta un nuevo invitado con su selección de menú y alérgenos.
     */
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['invitado'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos"]);
            exit;
        }

        // Extrae valores del invitado
        $nombre_inv = $data['invitado']['nombre_inv'];
        $apellidos = $data['invitado']['apellidos'];
        $email = $data['invitado']['email'];
        $asistencia = isset($data['invitado']['asistencia']) ?(int) filter_var($data['invitado']['asistencia'], FILTER_VALIDATE_BOOLEAN) :null;
        $transporte = (int) $data['invitado']['transporte'];
        $num_ninos = isset($data['invitado']['num_ninos']) ? (int) $data['invitado']['num_ninos'] : 0;
        $menu_id = (int) $data['invitado']['menu_id'];

        // Verifica si el menu_id es válido
        $query = "SELECT COUNT(*) FROM menus WHERE menu_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $menu_id);
        $stmt->execute();
        $stmt->bind_result($menuExists);
        $stmt->fetch();
        $stmt->close();

        if ($menuExists == 0) {
            http_response_code(400);
            echo json_encode(["error" => "El menu_id no es válido"]);
            exit;
        }

        // Comienza transacción
        $conn->begin_transaction();

        // Inserta el invitado
        $stmt = $conn->prepare("INSERT INTO invitados (nombre_inv, apellidos, email, asistencia, transporte, num_ninos, menu_id) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");

        $stmt->bind_param("sssiiii", $nombre_inv, $apellidos, $email, $asistencia, $transporte, $num_ninos, $menu_id);

        if (!$stmt->execute()) {
            throw new Exception("Error al insertar invitado: " . $stmt->error);
        }

        $invitadoId = $conn->insert_id; // Obtener el ID del invitado
        $stmt->close();

        // Alergenos existentes 
        $alergenos = $data['invitado']['alergenos'] ?? [];
        $otrosAlergenos = $data['invitado']['otrosAlergenos'] ?? '';

        $alergenosIds = [];

        // Procesamos los alérgenos seleccionados con checkbox (que ya existen)
        foreach ($alergenos as $alergeno) {
            if (!empty($alergeno['alergeno_id']) && is_numeric($alergeno['alergeno_id'])) {
                $alergenosIds[] = (int) $alergeno['alergeno_id'];
            }
        }

        // Procesamos los "otrosAlergenos"
        if (!empty($otrosAlergenos)) {
            $otros = array_map('trim', explode(',', $otrosAlergenos)); // Los separa por coma
            foreach ($otros as $nombre) {
                if ($nombre === '')
                    continue;

                $alergenoId = null;
                $stmt = $conn->prepare("SELECT id FROM alergenos WHERE nombre_alergeno = ?");
                $stmt->bind_param("s", $nombre);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($row = $result->fetch_assoc()) {
                    $alergenoId = $row['id'];
                }
                $stmt->close();

                // Si no existe, lo insertamos
                if (!$alergenoId) {
                    $stmt = $conn->prepare("INSERT INTO alergenos (nombre_alergeno) VALUES (?)");
                    $stmt->bind_param("s", $nombre);
                    if ($stmt->execute()) {
                        $alergenoId = $stmt->insert_id;
                    } else {
                        throw new Exception("Error al insertar alergeno '$nombre': " . $stmt->error);
                    }
                    $stmt->close();
                }

                if ($alergenoId) {
                    $alergenosIds[] = $alergenoId;
                }
            }
        }

        // Asociamos todos los alergenos al invitado
        foreach ($alergenosIds as $alergenoId) {
            $stmt = $conn->prepare("INSERT INTO invitado_alergenos (invitado_id, alergeno_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $invitadoId, $alergenoId);
            $stmt->execute();
            $stmt->close();
        }

        // Confirma la transacción
        $conn->commit();
        echo json_encode(["success" => true, "invitadoId" => $invitadoId]);
        exit;
    }

    // Método no permitido
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
} catch (Exception $e) {
    // Revertir si hay error en BD
    if ($conn->errno) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
} finally {
    $conn->close();
}

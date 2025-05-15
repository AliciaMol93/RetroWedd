<?php

use PHPUnit\Framework\TestCase;

class ApiTest extends TestCase
{
    protected $conn;

    protected function setUp(): void
    {
        $this->conn = $this->createMock(mysqli::class);
    }

    protected function tearDown(): void
    {
        $this->conn = null;
    }

    public function testGetMenus()
    {
        // Datos de prueba
        $expectedMenus = [
            ['menu_id' => 1, 'nombre_menu' => 'Menú 1'],
            ['menu_id' => 2, 'nombre_menu' => 'Menú 2']
        ];

        // Mock del resultado de la consulta
        $result = $this->createMock(mysqli_result::class);
        $result->expects($this->once())
            ->method('fetch_all')
            ->with(MYSQLI_ASSOC)
            ->willReturn($expectedMenus);

        // Configurar el mock de la conexión
        $this->conn->expects($this->once())
            ->method('query')
            ->with('SELECT menu_id, nombre_menu FROM menus')
            ->willReturn($result);

        // Simular la petición
        simulate_request('GET', 'getMenus');

        // Capturar la salida
        $output = capture_output(function() {
            getMenus($this->conn);
        });

        // Verificar que la salida es correcta
        $this->assertEquals(json_encode($expectedMenus), $output);
    }

    public function testGetAlergenos()
    {
        // Datos de prueba
        $expectedAlergenos = [
            ['id' => 1, 'nombre_alergeno' => 'Gluten'],
            ['id' => 2, 'nombre_alergeno' => 'Lactosa']
        ];

        // Mock del resultado de la consulta
        $result = $this->createMock(mysqli_result::class);
        $result->expects($this->once())
            ->method('fetch_all')
            ->with(MYSQLI_ASSOC)
            ->willReturn($expectedAlergenos);

        // Configurar el mock de la conexión
        $this->conn->expects($this->once())
            ->method('query')
            ->with('SELECT id, nombre_alergeno FROM alergenos')
            ->willReturn($result);

        // Simular la petición
        simulate_request('GET', 'getAlergenos');

        // Capturar la salida
        $output = capture_output(function() {
            getAlergenos($this->conn);
        });

        // Verificar que la salida es correcta
        $this->assertEquals(json_encode($expectedAlergenos), $output);
    }

    public function testGetAsistencia()
    {
        $email = 'test@example.com';
        $asistencia = true;

        $result = $this->createMock(mysqli_result::class);
        $result->expects($this->once())
            ->method('fetch_assoc')
            ->willReturn(['asistencia' => $asistencia]);

        $stmt = $this->createMock(mysqli_stmt::class);
        $stmt->expects($this->once())
            ->method('bind_param')
            ->with('s', $email);
        $stmt->expects($this->once())
            ->method('execute');
        $stmt->expects($this->once())
            ->method('get_result')
            ->willReturn($result);
        $stmt->expects($this->once())
            ->method('close');

        $this->conn->expects($this->once())
            ->method('prepare')
            ->with('SELECT asistencia FROM invitados WHERE email = ?')
            ->willReturn($stmt);

        simulate_request('GET', 'getAsistencia', ['email' => $email]);

        $output = capture_output(function() use ($email) {
            getAsistencia($this->conn, $email);
        });

        $this->assertEquals(json_encode(['asistencia' => $asistencia]), $output);
    }
} 
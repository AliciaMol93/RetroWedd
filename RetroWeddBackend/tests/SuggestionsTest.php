<?php

use PHPUnit\Framework\TestCase;

class SuggestionsTest extends TestCase
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

    public function testGetSuggestions()
    {
        // Datos de prueba
        $expectedSuggestions = [
            [
                'nombre_cancion' => 'Canción 1',
                'artista' => 'Artista 1',
                'nombre_inv' => 'Invitado 1',
                'apellidos' => 'Apellidos 1'
            ],
            [
                'nombre_cancion' => 'Canción 2',
                'artista' => 'Artista 2',
                'nombre_inv' => 'Invitado 2',
                'apellidos' => 'Apellidos 2'
            ]
        ];

        // Mock del resultado de la consulta
        $result = $this->createMock(mysqli_result::class);

        $result->expects($this->exactly(3))
            ->method('fetch_assoc')
            ->willReturnOnConsecutiveCalls(
                $expectedSuggestions[0],
                $expectedSuggestions[1],
                false
            );

        // Configurar el mock de la conexión
        $this->conn->expects($this->once())
            ->method('query')
            ->with("SELECT s.nombre_cancion, s.artista, i.nombre_inv, i.apellidos FROM sugerencias_canciones s JOIN invitados i ON s.invitado_id = i.id")
            ->willReturn($result);

        // Simular la petición
        simulate_request('GET', 'getSuggestions');

        // Capturar la salida
        $output = capture_output(function() {
            getSuggestions($this->conn);
        });

        // Verificar que la salida es correcta
        $this->assertEquals(json_encode($expectedSuggestions), $output);
    }

    public function testAddSongSuggestion()
    {
        // Datos de prueba
        $invitado_id = 1;
        $sugerencias = [
            [
                'nombre_cancion' => 'Nueva Canción',
                'artista' => 'Nuevo Artista'
            ]
        ];

        // Mock del statement
        $stmt = $this->createMock(mysqli_stmt::class);

        $stmt->expects($this->once())
            ->method('bind_param')
            ->with('ssi', 'Nueva Canción', 'Nuevo Artista', $invitado_id);

        $stmt->expects($this->once())
            ->method('execute')
            ->willReturn(true);

        $stmt->expects($this->once())
            ->method('close');

        // Configurar el mock de la conexión
        $this->conn->expects($this->once())
            ->method('prepare')
            ->with("INSERT INTO sugerencias_canciones (nombre_cancion, artista, invitado_id) VALUES (?, ?, ?)")
            ->willReturn($stmt);

        // Simular la petición
        simulate_request('POST', 'addSongSuggestion', [], [
            'invitado' => [
                'invitado_id' => $invitado_id,
                'sugerencias' => $sugerencias
            ]
        ]);

        // Capturar la salida
        $output = capture_output(function() use ($invitado_id, $sugerencias) {
            addSongSuggestion($this->conn, [
                'invitado' => [
                    'invitado_id' => $invitado_id,
                    'sugerencias' => $sugerencias
                ]
            ]);
        });

        // Verificar que la salida es correcta
        $this->assertEquals(
            json_encode(["success" => true, "message" => "Sugerencias guardadas correctamente"]),
            $output
        );
    }

    public function testAddSongSuggestionWithEmptyData()
    {
        // Simular la petición
        simulate_request('POST', 'addSongSuggestion', [], [
            'invitado' => []
        ]);

        // Capturar la salida
        $output = capture_output(function() {
            addSongSuggestion($this->conn, [
                'invitado' => []
            ]);
        });

        // Verificar que la salida es correcta
        $this->assertEquals(
            json_encode(["error" => "Datos incompletos"]),
            $output
        );
    }
} 
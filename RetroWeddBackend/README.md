# RetroWeddBackend

## Tests del Proyecto

Este proyecto incluye una suite de tests para verificar el correcto funcionamiento de las principales funcionalidades.

### Tests Implementados

1. **ApiTest**
   - `testGetMenus`: Verifica que se puedan obtener los menús correctamente
   - `testGetAlergenos`: Verifica que se puedan obtener los alérgenos correctamente
   - `testGetAsistencia`: Verifica que se pueda obtener el estado de asistencia de un invitado

2. **SuggestionsTest**
   - `testGetSuggestions`: Verifica que se puedan obtener las sugerencias de canciones
   - `testAddSongSuggestion`: Verifica que se puedan agregar nuevas sugerencias de canciones
   - `testAddSongSuggestionWithEmptyData`: Verifica el manejo de datos incompletos al agregar sugerencias

### Cómo Ejecutar los Tests

1. Tener instaladas las dependencias:
   composer install

2. Ejecutar los tests con uno de estos comandos:
   vendor/bin/phpunit

### Interpretación de los Resultados

- Si todos los tests pasan, verás un mensaje verde con "OK" y el número de tests ejecutados.
- Si hay algún fallo, verás un mensaje rojo indicando qué test falló y por qué.

### Configuración de la Base de Datos para Tests

Los tests utilizan la misma base de datos que la aplicación principal. Asegúrate de que:
- La base de datos esté creada
- Las tablas necesarias existan
- Los datos de prueba estén disponibles

### Notas Importantes

- Los tests verifican las funcionalidades principales de la API
- Se recomienda ejecutar los tests antes de cada despliegue
- Si todos los tests pasan, significa que las funcionalidades básicas están funcionando correctamente 
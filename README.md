# RetroWedd
RetroWedd es una aplicación web desarrollada para la gestión de invitados de una boda, incluyendo confirmación de asistencia (RSVP), selección de menú, alérgenos, transporte, y sugerencias de canciones. Está realizada con Angular (frontend) y PHP/MySQL (backend).

##  Estructura del repositorio

- **RetroWeddBackend/** → API REST en PHP + MySQL  
- **RetroWedd/** → Aplicación SPA en Angular

## Requisitos mínimos

### Backend
- PHP 8.0 o superior  
- MySQL 5.7 o superior  
- Apache o servidor compatible (XAMPP, Laragon, etc.)

### Frontend
- Node.js 18 o superior  
- npm 9 o superior  
- Angular CLI 15+  
  npm install -g @angular/cli

 **Instalación**
1. Clonar el repositorio:  
git clone https://github.com/AliciaMol93/Retrowedd.git
cd RetroWedd

2. Backend – RetroWeddBackend:  
-Copia la carpeta RetroWeddBackend a tu servidor local (htdocs).  
-Configura la base de datos: Edita db.php con tus credenciales (host, user, password, dbname).  
-Importa la base de datos:  
Ve a phpMyAdmin.    
Crea una base de datos nueva    
Importa el archivo retrowedd.sql (incluido en el proyecto).  

4. Frontend – RetroWedd  
cd RetroWedd
npm install
ng serve
Abre tu navegador en: http://localhost:4200

**Manual de usuario**  
Los usuarios pueden:    
  Confirmar asistencia.  
  Indicar transporte y número de niños.  
  Seleccionar su menú y alérgenos.  
  Sugerir canciones para la boda.  
  Ver la playlist de Spotify (al confirmar asistencia).

**Manual de configuración y administración**  
Las rutas API se encuentran en RetroWeddBackend/.  

El backend gestiona invitados, menús, alérgenos y sugerencias.  

Las sugerencias se vinculan al ID del invitado.  

Para pruebas, puedes usar herramientas como Postman.  

**Licencia**  
Proyecto realizado con fines académicos.

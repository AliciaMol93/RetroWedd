import { Component, OnInit } from '@angular/core';
import { RsvpService } from '../../services/rsvpService.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Componente para la vista de playlist.
 * Permite a los usuarios sugerir canciones para el evento una vez han confirmado su asistencia.
 */
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  imports: [RouterLink, FormsModule],
})
export default class PlaylistComponent implements OnInit {
  /** Indica si el usuario ha confirmado su asistencia al evento */
  attendanceConfirmed: boolean = false;
  message: string = '';

  /**
   * Modelo para el formulario de sugerencia de canciones
   * - song_name: Nombre de la canción
   * - artist: Artista de la canción
   */
  songInput = {
    song_name: '',
    artist: '',
  };

  /**
   * Inyecta el servicio RSVP que maneja la lógica de invitados y sugerencias.
   * @param rsvpService Servicio que maneja la lógica de backend relacionada con RSVP
   */
  constructor(private rsvpService: RsvpService) {}

  /**
   * Al inicializar el componente:
   * - Recupera el email del invitado (descifrado)
   * - Verifica si el invitado ha confirmado asistencia
   * - Suscribe al observable de asistencia para actualizar estado
   */
  ngOnInit(): void {
    //recupera el email descifrado y obtiene el estado de la asistencia
    const email = this.rsvpService.getEmailDescifrado();
    if (email) {
      this.rsvpService.getAsistenciaStatus(email).subscribe();
    }

    this.rsvpService.asistencia$.subscribe((valor) => {
      this.attendanceConfirmed = valor;
    });
  }
  /**
   * Envía una sugerencia de canción al backend si el invitado ha confirmado asistencia
   * y su ID está disponible en localStorage.
   */
  submitSuggestion(): void {
    console.log('Formulario enviado');
    const email = this.rsvpService.getEmailDescifrado();

    if (!email || !this.attendanceConfirmed) {
      this.message =
        'Debes confirmar tu asistencia antes de enviar una sugerencia.';
      return;
    }

    //obtiene el id del invitado
    const invitado_id = localStorage.getItem('invitado_id');

    if (!invitado_id || isNaN(Number(invitado_id))) {
      this.message = 'Error: no se encontró el ID del invitado o es inválido.';
      return;
    }

    const invitadoIdNumber = parseInt(invitado_id, 10); //lo convertimos a número

    // Ahora construimos el payload como lo espera el backend
    const newSuggestion = {
      invitado: {
        invitado_id: invitadoIdNumber,
        sugerencias: [
          {
            nombre_cancion: this.songInput.song_name,
            artista: this.songInput.artist,
          },
        ],
      },
    };

    console.log('📦 Payload enviado:', newSuggestion);

    // Enviar la sugerencia al backend
    this.rsvpService.saveSuggestion(newSuggestion).subscribe({
      next: () => {
        this.songInput = { song_name: '', artist: '' }; //limpia los campos del formulario
        this.message = '¡Sugerencia recibida!';
        setTimeout(() => {
          this.message = ''; // Limpia mensaje después de 3 segundos
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error al guardar la sugerencia:', error);
        this.message =
          'Hubo un error al guardar tu sugerencia. Inténtalo de nuevo.';
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
    });
  }
}

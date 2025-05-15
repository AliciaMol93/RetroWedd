import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Invitado } from '../components/rsvp/rsvp-form/invitadoInterface';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environment/environment';

const CLAVE_SECRETA = 'retrowedd123';

/**
 * Servicio para manejar operaciones relacionadas con RSVP,
 * como confirmación de asistencia, gestión de invitados, menús y sugerencias.
 *
 * @export
 * @class RsvpService
 */

@Injectable({
  providedIn: 'root',
})
export class RsvpService {
  /** URL base para las llamadas API */
  private apiUrl = environment.apiUrl;

  /** URL para manejar sugerencias */
  private suggestionUrl = environment.suggestionUrl;

  constructor(private http: HttpClient) {}

  /**
   * BehaviorSubject que mantiene el estado de asistencia del invitado.
   * @private
   */
  readonly #asistenciaSubject = new BehaviorSubject<boolean>(false);

  /**
   * Observable público para suscribirse a cambios en el estado de asistencia.
   */
  readonly asistencia$ = this.#asistenciaSubject.asObservable();

  /**
   * Obtiene los menús disponibles para el evento.
   *
   * @returns {Observable<any>} Observable con los menús.
   */
  getMenus(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getMenus`);
  }

  /**
   * Obtiene la lista de alérgenos disponibles.
   *
   * @returns {Observable<any>} Observable con los alérgenos.
   */
  getAlergenos(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getAlergenos`);
  }

  /**
   * Obtiene el email descifrado almacenado en localStorage.
   *
   * @returns {(string | null)} Email descifrado o null si no existe.
   */
  getEmailDescifrado(): string | null {
    const emailCifrado = localStorage.getItem('email');
    if (emailCifrado) {
      const bytes = CryptoJS.AES.decrypt(emailCifrado, CLAVE_SECRETA);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }

  /**
   * Guarda el email cifrado en localStorage usando AES.
   *
   * @param {string} email - Email a cifrar y guardar.
   * @returns {void}
   */
  guardarEmailCifrado(email: string): void {
    const emailCifrado = CryptoJS.AES.encrypt(email, CLAVE_SECRETA).toString();
    localStorage.setItem('email', emailCifrado);
  }

  /**
   * Crea un nuevo invitado en el backend.
   *
   * @param {Invitado} invitado - Objeto invitado con sus datos.
   * @returns {Observable<number>} Observable que emite el ID del invitado creado.
   * @throws Error si no se recibe el ID del invitado.
   */
  crearInvitado(invitado: Invitado): Observable<number> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (invitado.asistencia) {
      this.#asistenciaSubject.next(true);
    }

    return this.http.post<any>(this.apiUrl, { invitado }, { headers }).pipe(
      map((response) => {
        // Verificamos si la respuesta contiene el invitadoId
        if (response.success && response.invitadoId) {
          console.log('ID recibido del backend:', response.invitadoId);
          // Guardamos el invitadoId en localStorage
          localStorage.setItem('invitado_id', response.invitadoId.toString());
          return response.invitadoId; // Devolvemos el invitadoId
        } else {
          throw new Error('No se recibió el ID del invitado');
        }
      })
    );
  }

   /**
   * Consulta si el invitado con el email dado ha confirmado asistencia.
   *
   * @param {string} email - Email del invitado.
   * @returns {Observable<boolean>} Observable con el estado de asistencia.
   */
  getAsistenciaStatus(email: string): Observable<boolean> {
    return this.http
      .get<{ asistencia: boolean }>(
        `${this.apiUrl}?action=getAsistencia&email=${email}`
      )
      .pipe(
        map((response) => {
          this.#asistenciaSubject.next(response.asistencia);
          return response.asistencia;
        }) // Extraemos solo el valor de asistencia
      );
  }

  /**
   * Envía una sugerencia de canción al backend.
   *
   * @param {*} suggestion - Objeto con la sugerencia a enviar.
   * @returns {Observable<any>} Observable con la respuesta del servidor.
   */
  saveSuggestion(suggestion: any): Observable<any> {
    console.log('Enviando sugerencia con payload:', suggestion);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(
      `${this.suggestionUrl}?action=addSongSuggestion`,
      suggestion,
      { headers }
    );
  }
}

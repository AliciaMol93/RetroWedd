/**
 * Interface que representa un invitado al evento.
 *
 * @export
 * @interface Invitado
 */
export interface Invitado {
  nombre_inv: string;
  apellidos: string;
  email: string;
  asistencia: boolean;
  transporte: boolean;
  menu_id: number | null;
  num_ninos: number | null;
  alergenos: { alergeno_id: number; nombre_alergeno: string }[];
  otrosAlergenos: string;
}

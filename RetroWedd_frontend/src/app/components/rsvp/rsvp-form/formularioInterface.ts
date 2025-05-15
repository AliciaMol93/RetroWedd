/**
 * Interface que representa los datos del formulario RSVP.
 *
 * @export
 * @interface RsvpForm
 */
export interface FormularioInterface {

    name: string,
    apellidos: string,
    email: string,
    asistencia: boolean,
    transporte: boolean,
    num_ninos: number,
    menus: 'Vegano' | 'Vegetariano' | 'Clásico' | 'Embarazada',
    alergenos: {
      frutos_secos: boolean;
      lactosa: boolean;
      gluten: boolean;
    };
    otrosAlergenos?: string[];
  }


import { FormGroup } from "@angular/forms";
/**
 * Clase de utilidad para validación de formularios reactivos.
 * Proporciona métodos estáticos para comprobar el estado de los campos del formulario
 * y generar mensajes de error personalizados.
 */

export class FormUtils {

  /**
   * Verifica si un campo del formulario no es válido y ha sido tocado.
   *
   * @param form - FormGroup que contiene los controles del formulario.
   * @param fieldName - Nombre del campo a verificar.
   * @returns `true` si el campo tiene errores y ha sido tocado, `false` o `null` en caso contrario.
   */
  static isValidField(form: FormGroup, fieldName:string) : boolean | null{
    return!! form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  /**
   * Devuelve un mensaje de error personalizado para un campo del formulario.
   *
   * @param form - FormGroup que contiene los controles del formulario.
   * @param fieldName - Nombre del campo para el cual se desea obtener el error.
   * @returns Un string con el mensaje de error si existe, o `null` si no hay errores.
   */
  static getFieldError(form:FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';
        case 'pattern':
          return 'Solo se permiten letras y espacios';
          case 'min':
            return 'Has puesto un número incorrecto'
          case 'max':
            return 'El número máximo de niños es 3'
        case 'email':
          return 'Correo electrónico inválido';
      }
    }

    return null;
  }
}

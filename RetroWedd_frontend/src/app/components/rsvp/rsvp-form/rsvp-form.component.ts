import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Invitado } from './invitadoInterface';
import { RsvpService } from '../../../services/rsvpService.service';
import { FormUtils } from '../../../utils/form-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';
import { CommonModule } from '@angular/common';

/**
 * Componente para el formulario RSVP.
 * Gestiona la confirmación de asistencia, selección de menú y alergias del invitado.
 *
 * @export
 * @class RsvpFormComponent
 */

@Component({
  standalone:true,
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export default class RsvpFormComponent {

  /** Servicio para manejar operaciones relacionadas con RSVP */
  rsvpService = inject(RsvpService);

  /** FormBuilder para crear el formulario reactivo */
  private fb = inject(FormBuilder);

  /** Manejo de formulario */
  formUtils=FormUtils;
  route = inject(ActivatedRoute);
  router = inject(Router);

  mensaje: string="";

   /** Opciones de menú para seleccionar */
  menuOptions: string[] = ['Vegano', 'Vegetariano', 'Clásico', 'Embarazada'];

   /** Opciones de alérgenos para seleccionar */
  alergenoOptions = [
    { name: 'Frutos secos', value: 'frutos_secos' },
    { name: 'Lactosa', value: 'lactosa' },
    { name: 'Gluten', value: 'gluten' }
  ];

  /**
   * Formulario reactivo que contiene los campos del RSVP.
   * - name: Nombre del invitado, requerido y solo letras.
   * - apellidos: Apellidos, solo letras.
   * - email: Correo electrónico válido y requerido.
   * - asistencia: Confirmación de asistencia, requerido.
   * - transporte: Indica si requiere transporte.
   * - num_ninos: Número de niños, rango 0-3.
   * - menus: Selección de menú, requerido.
   * - alergenos: Grupo con los alérgenos seleccionados.
   * - otrosAlergenos: Campo para alergias no listadas.
   */
  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    apellidos: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    asistencia: [true, [Validators.required]],
    transporte: [false],
    num_ninos: [0, [Validators.min(0), Validators.max(3)]],
    menus: ['Clásico', [Validators.required]],
    alergenos: this.fb.group({
      frutos_secos: [false],
      lactosa: [false],
      gluten: [false],
    }),
    otrosAlergenos: [''],
  });

  returnToPlaylist: boolean = false;

  ngOnInit() {
    // Escuchar el cambio de checkbox de 'otros' para limpiar el campo
    this.myForm.get('alergenos.otros')?.valueChanges.subscribe((isChecked) => {
      if (!isChecked) {
        this.myForm.get('otrosAlergenos')?.setValue('');  // Si no se selecciona limpiar el campo
      }
    });

  //leemos el queryparam para que nos lleve a playlist si proviene de ahi
  this.route.queryParams.subscribe(params => {
    this.returnToPlaylist = params['from'] === 'playlist';
  });
  }
  // Método para obtener el grupo de alérgenos del formulario
  get alergenosFormGroup(): FormGroup {
    return this.myForm.get('alergenos') as FormGroup;
  }

  /**
   * Maneja el envío del formulario RSVP.
   * Valida, crea objeto invitado y llama al servicio para guardar datos.
   * Muestra mensajes de éxito o error al usuario.
   */
  onSave(){
  if(this.myForm.invalid){
    this.myForm.markAllAsTouched()
    return;
  }
  const formularioData = this.myForm.value;
  const asistencia = formularioData.asistencia === true || formularioData.asistencia === 'true';
  let alergenosSeleccionados: { alergeno_id: number, nombre_alergeno: string }[] = [];

  // Asignar los alérgenos seleccionados con su ID
  if (formularioData.alergenos.frutos_secos) {
    alergenosSeleccionados.push({ alergeno_id: 38, nombre_alergeno: 'Frutos secos' });
  }
  if (formularioData.alergenos.lactosa) {
    alergenosSeleccionados.push({ alergeno_id: 39, nombre_alergeno: 'Lactosa' });
  }
  if (formularioData.alergenos.gluten) {
    alergenosSeleccionados.push({ alergeno_id: 37, nombre_alergeno: 'Gluten' });
  }

  // Si hay algún valor en 'otrosAlergenos', lo agregamos al string
  const otrosAlergenos = formularioData.otrosAlergenos?.trim() || '';

  // Crear el objeto invitado con las propiedades correctas
  const invitado: Invitado = {
    nombre_inv: formularioData.name,
    apellidos: formularioData.apellidos,
    email: formularioData.email,
    asistencia: !!formularioData.asistencia,
    transporte: formularioData.transporte,
    num_ninos: formularioData.num_ninos,
    menu_id: this.menuOptions.indexOf(formularioData.menus) + 1,
    alergenos: alergenosSeleccionados,
    otrosAlergenos: otrosAlergenos,
  };

   // LLama al metodo para guardar el email
   this.rsvpService.guardarEmailCifrado(formularioData.email);

   //LLama al servicio para crear el invitado
   this.rsvpService.crearInvitado(invitado).subscribe({
    next: (response) => {
      this.mensaje = '🎉 ¡Mission Complete! ¡Nos vemos en el evento!';
      this.myForm.reset();


      if (this.returnToPlaylist) {this.router.navigate(['/playlist']);}

      // Limpia el mensaje después de 5 segundos
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    },
    error: (error) => {
      console.error('Error al enviar', error);
      this.mensaje = '❌ Ocurrió un error al enviar el formulario. Inténtalo de nuevo.';
    }
  });
  }
}

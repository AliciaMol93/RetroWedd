import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import RsvpFormComponent from './rsvp-form.component';
import { RsvpService } from '../../../services/rsvpService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('RsvpFormComponent', () => {
  let component: RsvpFormComponent;
  let fixture: ComponentFixture<RsvpFormComponent>;
  let rsvpService: jasmine.SpyObj<RsvpService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const rsvpServiceSpy = jasmine.createSpyObj('RsvpService', ['crearInvitado', 'guardarEmailCifrado']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = {
      queryParams: of({ from: 'playlist' })
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, RsvpFormComponent],

      providers: [
        FormBuilder,
        { provide: RsvpService, useValue: rsvpServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    rsvpService = TestBed.inject(RsvpService) as jasmine.SpyObj<RsvpService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.myForm.get('name')?.value).toBe('');
    expect(component.myForm.get('email')?.value).toBe('');
    expect(component.myForm.get('asistencia')?.value).toBe(true);
    expect(component.myForm.get('transporte')?.value).toBe(false);
    expect(component.myForm.get('num_ninos')?.value).toBe(0);
    expect(component.myForm.get('menus')?.value).toBe('Clásico');
  });

  it('should validate required fields', () => {
    const form = component.myForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      name: 'Test',
      email: 'test@example.com',
      asistencia: true
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.myForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate num_ninos range', () => {
    const numNinosControl = component.myForm.get('num_ninos');
    numNinosControl?.setValue(-1);
    expect(numNinosControl?.valid).toBeFalsy();

    numNinosControl?.setValue(4);
    expect(numNinosControl?.valid).toBeFalsy();

    numNinosControl?.setValue(2);
    expect(numNinosControl?.valid).toBeTruthy();
  });

  it('should handle form submission with valid data', fakeAsync(() => {
    const mockResponse = 1;
    rsvpService.crearInvitado.and.returnValue(of(mockResponse));
    rsvpService.guardarEmailCifrado.and.returnValue();

    component.myForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      asistencia: true,
      transporte: false,
      num_ninos: 1,
      menus: 'Clásico',
      alergenos: {
        frutos_secos: false,
        lactosa: false,
        gluten: false
      },
      otrosAlergenos: ''
    });

    component.onSave();
    tick();

    expect(rsvpService.crearInvitado).toHaveBeenCalled();
    expect(rsvpService.guardarEmailCifrado).toHaveBeenCalledWith('test@example.com');
    expect(component.mensaje).toBe('🎉 ¡Mission Complete! ¡Nos vemos en el evento!');
    expect(router.navigate).toHaveBeenCalledWith(['/playlist']);
  }));

  it('should handle form submission with error', fakeAsync(() => {
    rsvpService.crearInvitado.and.returnValue(throwError(() => new Error('Test error')));

    component.myForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      asistencia: true
    });

    component.onSave();
    tick();

    expect(component.mensaje).toBe('❌ Ocurrió un error al enviar el formulario. Inténtalo de nuevo.');
  }));

  it('should not submit invalid form', () => {
    component.onSave();
    expect(rsvpService.crearInvitado).not.toHaveBeenCalled();
    expect(component.myForm.touched).toBeTruthy();
  });

  it('should handle alergenos selection', () => {
    const alergenosGroup = component.alergenosFormGroup;
    expect(alergenosGroup).toBeTruthy();

    alergenosGroup.patchValue({
      frutos_secos: true,
      lactosa: false,
      gluten: true
    });

    expect(alergenosGroup.get('frutos_secos')?.value).toBeTrue();
    expect(alergenosGroup.get('lactosa')?.value).toBeFalse();
    expect(alergenosGroup.get('gluten')?.value).toBeTrue();
  });

  it('should initialize with returnToPlaylist true when from playlist', () => {
    expect(component.returnToPlaylist).toBeTrue();
  });
});

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import  PlaylistComponent  from './playlist.component';
import { RsvpService } from '../../services/rsvpService.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;
  let rsvpServiceMock: jasmine.SpyObj<RsvpService>;

  beforeEach(async () => {
    // Crear un mock espía del servicio
    rsvpServiceMock = jasmine.createSpyObj('RsvpService', [
      'getEmailDescifrado',
      'getAsistenciaStatus',
      'saveSuggestion'
    ], {
      asistencia$: of(true) // Definimos asistencia$ como propiedad del mock
    });

    // Configurar valores por defecto para los métodos mockeados
  rsvpServiceMock.getEmailDescifrado.and.returnValue('test@example.com');
  rsvpServiceMock.getAsistenciaStatus.and.returnValue(of(true));
  rsvpServiceMock.saveSuggestion.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterLink],
      providers: [
        { provide: RsvpService, useValue: rsvpServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get attendance status on init if email is available', () => {
    expect(rsvpServiceMock.getEmailDescifrado).toHaveBeenCalled();
    expect(rsvpServiceMock.getAsistenciaStatus).toHaveBeenCalledWith('test@example.com');
  });

  it('should call saveSuggestion and handle success response', () => {
    // Simular datos de entrada
    component.songInput = { song_name: 'Test Song', artist: 'Test Artist' };
    component.attendanceConfirmed = true;
    spyOn(localStorage, 'getItem').and.returnValue('123');

    component.submitSuggestion();

    expect(rsvpServiceMock.saveSuggestion).toHaveBeenCalled();
  });

  it('should handle error when saveSuggestion fails', fakeAsync(() => {
    // Configurar el mock para que falle
    rsvpServiceMock.saveSuggestion.and.returnValue(
      throwError(() => ({
        status: 500,
        error: { message: 'Error de servidor' }
      }))
    );

    component.songInput = { song_name: 'Test Song', artist: 'Test Artist' };
    component.attendanceConfirmed = true;
    spyOn(localStorage, 'getItem').and.returnValue('123');

    component.submitSuggestion();
    tick();

    // Verificar manejo de errores
    expect(component.message).toBe('Hubo un error al guardar tu sugerencia. Inténtalo de nuevo.');
  }));

  it('should set the message when trying to submit without invitado_id', () => {
    component.songInput = { song_name: 'Test Song', artist: 'Test Artist' };
    component.attendanceConfirmed = true;
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.submitSuggestion();

    expect(component.message).toContain('no se encontró el ID del invitado');
  });
});

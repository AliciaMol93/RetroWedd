import { TestBed } from '@angular/core/testing';
import { RsvpService } from './rsvpService.service';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController} from '@angular/common/http/testing';
import { environment} from '../../environment/environment';
import { Invitado } from '../components/rsvp/rsvp-form/invitadoInterface';


describe('RsvpService', () => {
  let service: RsvpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [RsvpService, provideHttpClientTesting(), provideHttpClient()]
    });

    service = TestBed.inject(RsvpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear un invitado y devolver su ID', () => {
    const mockInvitado: Invitado = {
      nombre_inv: 'Test',
      apellidos: 'User',
      email: 'test@example.com',
      asistencia: true,
      transporte: true,
      menu_id: 1,
      num_ninos: 0,
      alergenos: [],
      otrosAlergenos: ''
    };

    const mockResponse = { success: true, invitadoId: 123};

    //LLama al método crearInvitado
    service.crearInvitado(mockInvitado).subscribe(response => {
      expect(response).toBe(123);
      expect(localStorage.getItem('invitado_id')).toBe('123');
    });

    // Verifica la URL y el método de la petición
    const req = httpMock.expectOne(environment.apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ invitado: mockInvitado });

    //Responde la petición
    req.flush(mockResponse);
    httpMock.verify();
  });
});

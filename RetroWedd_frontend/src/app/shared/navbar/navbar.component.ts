import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Estado del menú
  isMenuOpen: boolean = false;

  // Lista de los elementos del menú
  menuItems = [
    { label: 'Inicio', path: '/home' },
    { label: 'Nosotros', path: '/aboutus' },
    { label: 'Itinerario', path: '/itinerary' },
    { label: 'Playlist', path: '/playlist' },
    { label: 'Localización', path: '/location' },
    { label: 'RSVP', path: '/rsvp' }
  ];

  // Método para alternar la visibilidad del menú en móvil
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

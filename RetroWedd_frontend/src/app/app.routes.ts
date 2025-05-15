import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component'),
  },
  {
    path: 'aboutus',
    loadComponent: () =>
      import('./components/about-us/about-us.component')
  },
  {
    path: 'itinerary',
    loadComponent: () =>
      import('./components/itinerary/itinerary.component')
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./components/location/location.component')
  },
  {
    path: 'playlist',
    loadComponent: () =>
      import('./components/playlist/playlist.component')
  },
  {
    path: 'rsvp',
    loadComponent: () =>
      import('./components/rsvp/rsvp-form/rsvp-form.component')
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/home/home.component')
  }
];

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export default class AboutUsComponent {
  commonText = `Un 2016 Iváni (nuestro amigo en común) invitó a Ali al festival Etnosur,
  ella sin mucho que perder se fue con "La Mari" y dos amigos más de Iváni.
  Nos recoge un VW Polo azul que lleva Iván.
  Primeras miradas, nervios, timidez, feria de baza, primeras veces, hogar, Tony,
  viajes, nuevas experiencias, yoda, nuevos proyectos, nuevas amistades, Viena... y Sí, quiero.`;

  //para saltos de linea
  formatText(text?: string): string {
    return (text ?? '').replace(/\n/g, '<br>');
  }

photos=[
  { i:0,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.29.06 (2).jpeg',
    caption:'Etnosur 2016',
    text:this.commonText,
  },
  {
    i:1,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.29.05.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
  },
  {
    i:2,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.29.06 (1).jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:3,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.23.34.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:4,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.29.06 (3).jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:5,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.29.06.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:6,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.48.12.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },

  {
    i:7,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 20.26.25.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:8,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 20.26.26 (1).jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:9,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 20.26.26 (2).jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:10,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 20.26.26.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:11,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 20.26.27.jpeg',
    caption:'Etnosur 2016',
    text: this.commonText
    },
  {
    i:12,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 19.29.07.jpeg',
    caption:'amigo en común',
    text: this.commonText
    },
  {
    i:13,
    src:'/assets/images/WhatsApp Image 2025-04-20 at 21.16.35.jpeg',
    caption:'Viena',
    text: this.commonText
    },
]
currentIndex = 0;

nextPhoto() {
  this.currentIndex = (this.currentIndex + 1) % this.photos.length;
}

prevPhoto() {
  this.currentIndex =
    (this.currentIndex - 1 + this.photos.length) % this.photos.length;
}
}

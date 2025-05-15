import { Component, ElementRef, OnInit, signal, viewChild, viewChildren } from '@angular/core';

@Component({
  selector: 'app-itinerary',
  imports: [],
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css']
})
export default class ItineraryComponent implements OnInit{
  // Datos del itinerario de la boda
  events=[
    { i:0,
      title: 'ceremonia',
      description:"¡Esto va a ser épico, no lo dudéis! El escenario está listo, las luces se apagan, y nosotros estamos aquí para empezar a hacer historia. Como diría el gran Jimi Hendrix, 'la música no miente', y nosotros tampoco. Así que, olvídate de las palabras, hoy sólo se trata de vivir el momento. ¡Bienvenidos, estamos listos para darlo todo!",
      hour: '18:00h',

    },
    { i:1,
      title: 'cóctel de bienvenida',
      description: 'El cóctel es la antesala del gran show, donde las conversaciones fluyen tan rápido como los tragos. Aquí no hay tiempos muertos, solo risas y brindis que marcan el ritmo del día. Como si estuviéramos en pleno festival, este es el momento de conectar, relajarse y preparar las energías para lo que se viene. ¡Que suene la música y que no pare el buen rollo!',
      hour: '19:00',

    },
    { i:2,
      title: 'banquete',
      description: '¡Hora del banquete, y que no falte de nada! Aquí estamos, disfrutando de una comida que bien podría ser un backstage de un gran evento, donde todos estamos disfrutando de la mejor parte del día. Como una buena playlist que no se detiene, el festín sigue, las risas no cesan, y cada plato es como el acorde perfecto para acompañar esta fiesta. ¡A comer y a disfrutar, que el show sigue!',
      hour: '21:00',

    },
    { i:3,
      title: 'fiesta',
      description: "¡Y ahora sí, amigos! ¡La fiesta arranca! Ya no hay vuelta atrás. Olvida todo lo que sabes de 'buenas costumbres', porque esta noche se baila como si no existiera el mañana, se canta como si estuviéramos en un escenario y se ríe hasta que nos duela la barriga. Los verdaderos rockstars están aquí, y la pista de baile es nuestro escenario. ¡A romperla!",
      hour: '22:00',

    },
    { i:4,
      title: 'A casa',
      description: "Gracias a todas esas personas que nos han acompañado en nuestro día más especial. Gracias por estar, por reír, por bailar, por brindar, por hacernos sentir tan queridos. Hoy ha sido mágico, y en parte, ha sido por vosotros. ¡Nos habéis regalado una fiesta inolvidable!",
      hour: '...',

    }
  ];

  constructor() { }

  ngOnInit(): void {

  }



}


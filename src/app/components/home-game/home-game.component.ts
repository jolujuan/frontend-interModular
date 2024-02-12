import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home-game',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.css'
})
export class HomeGameComponent {
   copiarAlPortapapeles(idElemento:string) {
    let texto = document.getElementById(idElemento)!.innerText;
    navigator.clipboard.writeText(texto).then(function() {
        console.log('Texto copiado al portapapeles');
    }, function(err) {
        console.error('Error al copiar el texto: ', err);
    });
}
}

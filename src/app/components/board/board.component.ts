import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  idBoard!: number;
  interval!: any;
  @Input()
  set setgame(value: number) {
    this.idBoard = value;
  }
}

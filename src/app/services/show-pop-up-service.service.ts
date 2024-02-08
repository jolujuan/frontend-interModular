import {
  EventEmitter,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShowPopUpServiceService {
  onClosePopup = new EventEmitter<void>();

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  popup(type: any) {
    const format = (type: any) => {
      switch (type) {
        case 'favorites':
          return '<p>Inicia sesión para mostrar favoritos.</p>';
          break;
        case 'register':
          return '<p>Usuario registrado exitosamente. Por favor revisa tu correo.</p>';
          break;
        case 'profile':
          return '<p>Inicia sesión para mostrar el perfil.</p>';
          break;
        case 'expira':
          return '<p> La sesión ha expirado. Por favor, vuelve a iniciar sesión. </p>';
          break;
        case 'favoritesSave':
          return '<p>Inicia sesión para guardar favoritos. </p>';
          break;
        default:
          return '<p>Contenido no disponible.</p>';
          break;
      }
    };

    const divPopup = document.createElement('div');
    divPopup.innerHTML = `<div id="popup" class="popup" style="display:none;">
          <div class="popup-content">
              <span class="close-btn">&times;</span>
              ${format(type)}
          </div>
    </div>`;

    // Agrega el manejador de eventos para el botón de cerrar
    const closeButton = divPopup.querySelector('.close-btn');
    closeButton?.addEventListener('click', this.closePopup);

    return divPopup;
  }

  showPopup() {
    document.getElementById('popup')!.style.display = 'block';
  }
  /* Enviar a login cuando cierras pop up */
  closePopup = () => {
    this.onClosePopup.emit();
    document.getElementById('popup')!.style.display = 'none';
  };
}

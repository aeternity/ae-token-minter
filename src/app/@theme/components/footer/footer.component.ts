import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      With ♥ by <b><a href="https://aeternity.com/" target="_blank">Aeternity</a></b> 2022
    </span>
    <div class="socials">
      <a href="https://github.com/aeternity" target="_blank" class="ion ion-social-github"></a>
      <a href="https://twitter.com/aeternity" target="_blank" class="ion ion-social-twitter"></a>
    </div>
  `,
})
export class FooterComponent {
}

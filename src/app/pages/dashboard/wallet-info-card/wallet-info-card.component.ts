import { Component, Input } from '@angular/core';
import { NbCardModule, NbIconLibraries } from '@nebular/theme';
import { StateService } from '../../../@core/utils/state.service';

@Component({
  standalone: true,
  selector: 'wallet-info-card',
  styleUrls: ['./wallet-info-card.component.scss'],
  imports: [NbCardModule],
  template: `

    <!-- feature to toggle card on or off:  <nb-card matRipple (click)="on = !on" [ngClass]="{'off': !on}"> -->
    <nb-card matRipple class="shinyCard" [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon status-{{ type }}">
        <i [ngClass]="nbIconName"></i>
        </div>
      </div>

      <div class="details">
        <div class="title h5">{{ title }}</div>
        <div class="status paragraph-2">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="icon-container" style="margin-left: auto">
        <div class="greyContainer icon status-{{ type }}">
        View
        </div>
      </div>

      <div class="icon-container" style="margin-left: 0">
        <div class="greyContainer icon status-{{ type }}">
        Share
        </div>
      </div>

    </nb-card>
  `,
})
export class WalletInfoCardComponent {

  @Input() title: string;
  @Input() type: StatusType;
  @Input() on = true;
  @Input() nbIconName: string;

  constructor(iconsLibrary: NbIconLibraries, state: StateService) {
    let icons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
console.log(icons)
  }
  
}

export type StatusType = 'primary' | 'success'| 'info' | 'warning' | 'danger';


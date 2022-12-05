import { Component, Input, OnInit } from '@angular/core';
import { NbCardModule, NbIconLibraries } from '@nebular/theme';
import { StateService } from '../../../@core/utils/state.service';

@Component({
  selector: 'wallet-info-card',
  styleUrls: ['./wallet-info-card.component.scss'],
  template: `

    <!-- feature to toggle card on or off:  <nb-card matRipple (click)="on = !on" [ngClass]="{'off': !on}"> -->
    <nb-card matRipple style='display: flex;' class="shinyCard" [ngClass]="{'off': !on}">
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

      <div *ngIf="this.buttonURL != ''" (click)="open(this.buttonURL)" style='flex-grow: 1; display: flex;' class="icon-container">
      <!-- <div ngIf="buttonUrl" onClick="parent.open(buttonUrl)" style='flex-grow: 1; display: flex;' class="icon-container"> -->
      <!-- <div class="icon-container" style="margin-left: auto"> -->
        <div style='flex-grow: 1;' class="greyContainer icon status-{{ type }}">
        View
        </div>
      </div>

     <!--  <div class="icon-container" style="margin-left: 0">
        <div class="greyContainer icon status-{{ type }}">
        Share
        </div>
      </div> -->

    </nb-card>
  `,
})
export class WalletInfoCardComponent implements OnInit {

  @Input() title: string;
  @Input() type: StatusType;
  @Input() on = true;
  @Input() nbIconName: string;
  @Input() buttonURL: string = ""
  
  window: Window & typeof globalThis

  constructor(iconsLibrary: NbIconLibraries, state: StateService) {
/*     let icons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
console.log(icons) */
}

ngOnInit() {
  console.log('button url', this.buttonURL) 

}

open(url: string) {
  window.open(url);
}

}

export type StatusType = 'primary' | 'success'| 'info' | 'warning' | 'danger';


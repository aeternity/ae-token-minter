import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { StateService } from '../../../@core/utils/state.service';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { NbPopoverDirective } from '@nebular/theme';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
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

      <!-- 'View button for NFTs' -->
      <div *ngIf="contractType == 'nft'" (click)="this.router.navigate(['/' + contractType + '/show', this.nftAddress])" class="icon-container" style="margin-left: auto">
        <div class="greyContainer icon status-{{ type }}">
        View
        </div>
      </div>

      <!-- 'View button for tokens' -->
      <div *ngIf="contractType == 'token'" class="icon-container" style="margin-left: auto" >
        <div [nbPopover]="walletPreview" nbPopoverTrigger="hover" nbPopoverPlacement="top" class="greyContainer token icon status-{{ type }}">
        View
        </div>
      </div>
      <ng-template  #walletPreview>
        
      


      <!-- <nb-card size="medium" class="slideUp"> -->
      <nb-card class="slideUp" style='width:300px'>
      

      <nb-card-header> Find it here ! </nb-card-header>
      <nb-card-body> 
        <div class="col-md-16" id=imageContainer>
          
          <img [src]="'assets/images/shtokenpreview.png'" [alt]="'lol'" style='width:100%; height:auto; object-fit: contain' />
          
        </div>


           <!-- <img rawSrc="'assets/images/shtokenpreview.png'" width="200"   height="200" priority> -->
    <!--    <img src="assets/images/shtokenpreview.png" alt=""> -->
      </nb-card-body>
      <nb-card-footer>Open Superhero Wallet, click your account and select the token you've just created !</nb-card-footer>
    </nb-card>

      </ng-template>

      <div (click)="this.copyContractAddress()" nbPopover="Address copied to clipboard !" nbPopoverTrigger="noop" class="icon-container" style="margin-left: 0">
        <div class="greyContainer icon status-{{ type }}">
        Share
        </div>
      </div>

    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: StatusType;
  @Input() on = true;
  @Input() nbIconName: string;
  @Input() nftAddress: string;
  @Input() contractType: 'nft' | 'token'

  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @ViewChildren(NbPopoverDirective) popovers: QueryList<NbPopoverDirective>;
  
  constructor(iconsLibrary: NbIconLibraries, state: StateService, public router: Router, private clipboard: Clipboard) {
    let icons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);
console.log(icons)
  }

  copyContractAddress(){
    this.clipboard.copy(this.nftAddress);
    this.popover.show();
    setTimeout(() => {
      this.popover.hide();
    }, 2000);
  }

  setPopoverVisible(id : string, show: boolean, hideAfter? : number) {
    let popovers : Array<NbPopoverDirective> = this.popovers["_results"]
    let onePopover : NbPopoverDirective = popovers.find(element => element.context == id)
    show ?
    onePopover.show() :
    onePopover.hide()
    if (show == true && hideAfter) {
      setTimeout(() => {
        onePopover.hide();
      }, hideAfter);
    }
  }
  
}

export type StatusType = 'primary' | 'success'| 'info' | 'warning' | 'danger';


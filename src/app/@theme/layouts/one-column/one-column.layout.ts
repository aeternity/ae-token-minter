import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `

  <!-- display in window mode or not ? -->
    <nb-layout windowMode>
    <!-- <nb-layout> -->

      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

 <!-- add or remove sidebar -->
 
    <!--   <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar> -->

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {}

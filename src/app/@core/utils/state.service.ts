import { Injectable, OnDestroy } from '@angular/core';
import { of as observableOf,  Observable,  BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';

@Injectable()
export class StateService implements OnDestroy {

  platform : "mobile" | "desktop";
  browser : string;

  protected layouts: any = [
    {
      name: 'One Column',
      icon: 'nb-layout-default',
      id: 'one-column',
      selected: true,
    },
    {
      name: 'Two Column',
      icon: 'nb-layout-two-column',
      id: 'two-column',
    },
    {
      name: 'Center Column',
      icon: 'nb-layout-centre',
      id: 'center-column',
    },
  ];

  protected sidebars: any = [
    {
      name: 'Sidebar at layout start',
      icon: 'nb-layout-sidebar-left',
      id: 'start',
      selected: true,
    },
    {
      name: 'Sidebar at layout end',
      icon: 'nb-layout-sidebar-right',
      id: 'end',
    },
  ];

  protected layoutState$ = new BehaviorSubject(this.layouts[0]);
  protected sidebarState$ = new BehaviorSubject(this.sidebars[0]);

  alive = true;

  constructor(directionService: NbLayoutDirectionService) {
    directionService.onDirectionChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(direction => this.updateSidebarIcons(direction));

    this.updateSidebarIcons(directionService.getDirection());
    this.checkForBrowserAndPlattform();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private updateSidebarIcons(direction: NbLayoutDirection) {
    const [ startSidebar, endSidebar ] = this.sidebars;
    const isLtr = direction === NbLayoutDirection.LTR;
    const startIconClass = isLtr ? 'nb-layout-sidebar-left' : 'nb-layout-sidebar-right';
    const endIconClass = isLtr ? 'nb-layout-sidebar-right' : 'nb-layout-sidebar-left';
    startSidebar.icon = startIconClass;
    endSidebar.icon = endIconClass;
  }

  checkForBrowserAndPlattform(): void{
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.platform = 'mobile';
    }else{
      this.platform = 'desktop';
    }

    const agent = window.navigator.userAgent.toLowerCase();
    
    this.browser =
      agent.indexOf('edge') > -1 ? 'Microsoft Edge'
        : agent.indexOf('edg') > -1 ? 'Chromium-based Edge'
        : agent.indexOf('opr') > -1 ? 'Opera'
        : agent.indexOf('chrome') > -1 ? 'Chrome'
        : agent.indexOf('trident') > -1 ? 'Internet Explorer'
        : agent.indexOf('firefox') > -1 ? 'Firefox'
        : agent.indexOf('safari') > -1 ? 'Safari'
        : 'other';
  }

  setLayoutState(state: any): any {
    this.layoutState$.next(state);
  }

  getLayoutStates(): Observable<any[]> {
    return observableOf(this.layouts);
  }

  onLayoutState(): Observable<any> {
    return this.layoutState$.asObservable();
  }

  setSidebarState(state: any): any {
    this.sidebarState$.next(state);
  }

  getSidebarStates(): Observable<any[]> {
    return observableOf(this.sidebars);
  }

  onSidebarState(): Observable<any> {
    return this.sidebarState$.asObservable();
  }
}

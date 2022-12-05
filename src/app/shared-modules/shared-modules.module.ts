import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule,  } from '@angular/material/icon';
import {
  NbSpinnerModule,
} from '@nebular/theme';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { cryptoAe } from '@ng-icons/cryptocurrency-icons';


const materialModules = [
  MatIconModule,
  MatInputModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...materialModules,
    NbSpinnerModule,
    FormsModule,
    NgIconsModule.withIcons({ cryptoAe }),
  ],
  exports: [
    ...materialModules,
    NbSpinnerModule,
    FormsModule,
    NgIconsModule
  ]
})
export class SharedModulesModule { }

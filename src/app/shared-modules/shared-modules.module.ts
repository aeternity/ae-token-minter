import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule,  } from '@angular/material/icon';
import {
  NbSpinnerModule,
} from '@nebular/theme';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';


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
    FormsModule
  ],
  exports: [
    ...materialModules,
    NbSpinnerModule,
    FormsModule
  ]
})
export class SharedModulesModule { }

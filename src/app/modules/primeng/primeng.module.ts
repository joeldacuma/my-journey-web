import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [],
  imports: [],
  exports: [
    PanelMenuModule,
    PanelModule,
    MenuModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    InputTextModule
  ]
})
export class PrimengModule { }

import { NgModule } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

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
    InputTextModule,
    RippleModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    TooltipModule
  ]
})
export class PrimengModule { }
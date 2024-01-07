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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

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
    TooltipModule,
    ProgressSpinnerModule,
    TableModule,
    PaginatorModule,
    TagModule,
    OverlayPanelModule,
    DropdownModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule
  ]
})
export class PrimengModule { }

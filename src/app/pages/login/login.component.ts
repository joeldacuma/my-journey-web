import { Component, inject, signal, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router } from "@angular/router";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder} from "@angular/forms";
import { catchError, lastValueFrom, map } from "rxjs";
import { MessageService } from 'primeng/api';
import { PrimengModule } from "@modules/index";
import { IAgendaLoginProps, ILoginAuthProps, IAuthProps } from "@interfaces/index";
import { LoginForm } from "@forms/index";
import { AgendaService, StrapiService } from "@api/index";
import { LocalstorageService } from '@services/index';
import { MY_JOURNEY_AUTH_CONSTANT, 
         ERROR_MESSAGE_LOGIN_EMPTY_FIELDS,
         ERROR_MESSAGE_LOGIN_FAILED_TITLE,
         SUCCESS_MESSAGE_LOGIN_DETAILS,
         SUCCESS_MESSAGE_LOGIN_TITLE ,
         ROUTE_DASHBOARD} from '@constants/index';

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
  ],
  providers:[
    MessageService
   ],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private router = inject(Router);
  private agendaService = inject(AgendaService);
  private strapiService = inject(StrapiService);
  private localStorageService = inject(LocalstorageService);
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  public loginFormGroup = new FormGroup<IAgendaLoginProps>(LoginForm);
  public submitted = false;
  public loading = signal(false);

  ngOnInit() {};

  get formFields(): {[key: string]: any} {
    return this.loginFormGroup.controls;
  }

  async onSubmit() {
    this.submitted = true;
    this.loading = signal(true);
    if (!this.loginFormGroup.valid) {
      this.loading.update(() => false);
      return;
    }

    const { email, password } = this.loginFormGroup.value;
    const body = { email: email, password };

    await lastValueFrom(
      this.agendaService.login(body).pipe(
        map((result: ILoginAuthProps) => {
          this.messageService.add({
            key: 'login', 
            severity:'info', 
            summary: SUCCESS_MESSAGE_LOGIN_TITLE,
            detail: SUCCESS_MESSAGE_LOGIN_DETAILS
          })
          if (result) {
          setTimeout(() => {
              this.localStorageService.setItem(MY_JOURNEY_AUTH_CONSTANT, result);
              this.router.navigate([ROUTE_DASHBOARD]);
           }, 1000);   
          }
        }),
        catchError((error) => {
          this.messageService.add({
            key: 'login', 
            severity:'error', 
            summary: ERROR_MESSAGE_LOGIN_FAILED_TITLE,
            detail: ERROR_MESSAGE_LOGIN_EMPTY_FIELDS
          })
          return error;
        })
      )
    ).finally(() => {
      this.loading.update(() => false);
    });

    // const strapiAuthResult = await lastValueFrom(
    //   this.strapiService.login(body).pipe(
    //     map((result: IAuthProps) => {
    //       this.messageService.add({
    //         key: 'login', 
    //         severity:'info', 
    //         summary: SUCCESS_MESSAGE_LOGIN_TITLE,
    //         detail: SUCCESS_MESSAGE_LOGIN_DETAILS
    //       })
    //       if (result) {
    //         setTimeout(() => {
    //           this.localStorageService.setItem(MY_JOURNEY_AUTH_CONSTANT, result);
    //           this.router.navigate(['/']);
    //         }, 2000);
    //       }
    //     }),
    //     catchError((error) => {
    //       this.messageService.add({
    //         key: 'login', 
    //         severity:'error', 
    //         summary: ERROR_MESSAGE_LOGIN_FAILED_TITLE,
    //         detail: ERROR_MESSAGE_LOGIN_EMPTY_FIELDS
    //       })
    //       return error;
    //     })
    //   )
    // );
  }

  constructor() {
    this.loginFormGroup = this.formBuilder.group(LoginForm);
    effect(() => {
      console.log(this.loading());
    });
  }
}

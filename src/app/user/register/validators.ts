import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Auth, fetchSignInMethodsForEmail } from '@angular/fire/auth'

export function Match(controlName: string, matchingControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName)
    const matchingControl = group.get(matchingControlName)

    if(!control || !matchingControl) {
      console.error('Form controls can not be found in the in the form group')
      return {controlNotFound: false}
    }
    const error = control.value === matchingControl.value ? null : {notMatch: true}
    matchingControl.setErrors(error)
    return error
  }

}

@Injectable({providedIn: 'root'})
export class EmailTaken implements AsyncValidator {
  public auth = inject(Auth)

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return fetchSignInMethodsForEmail(this.auth, control.value)
      .then(res =>  res.length ? {emailTaken: true} : null)
  }
}

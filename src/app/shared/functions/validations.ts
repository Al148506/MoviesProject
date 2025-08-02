import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function firstCapitalLetter(): ValidatorFn {
    return (control:AbstractControl): ValidationErrors | null => {
        const value = control.value as string;
        const message ='This field must start with a capital letter';
        if (!value) return null; // No validation if the field is empty
        if (value.length === 0) return null; // No validation if the field is empty
        const firstLetter = value.charAt(0);
        const isValid = firstLetter === firstLetter.toUpperCase();
        return isValid ? null : { firstCapitalLetter: message };
    };
}

export function dateCantBeFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = new Date(control.value);
        const today = new Date();
       
        if (value > today) {
            return { 
                future:{
                    message: 'The date cannot be in the future'
                }
            }
        }
        return null;
    }
}

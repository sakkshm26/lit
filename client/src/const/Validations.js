import * as yup from 'yup';
import {TenDigitNumberRegex} from './regex';

export const LoginFormSchema = yup.object({
  phone: yup
    .string()
    .matches(TenDigitNumberRegex, {
      message: 'Enter a valid phone number',
    })
    .required('Phone number is required'),
  password: yup
    .string()
    .min(6, 'Password length should be more than 5 characters')
    .max(20, 'Password length should be less than 20 characters')
    .required('Password is required'),
});

export const Form1Schema = yup.object({
  username: yup
    .string()
    .required('Username is required ')
    .min(2, 'Username should be more than 2 characters')
    .max(15, 'Username should be less than 15 characters'),
  /* email: yup
    .string()
    .email('enter a valid email')
    .required('email is required')
    .min(5, 'email should be more than 2 characters')
    .max(50, 'email should be less than 50 characters'), */
  age: yup
    .number()
    .typeError('Enter a number')
    .min(13, 'You should be atleast 13 years old')
    .max(100, 'Enter a valid age')
    .required('Age is required'),
});

export const Form6Schema = yup.object({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name should be more than 2 characters')
    .max(15, 'Last name should be less than 15 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name should be more than 2 characters')
    .max(15, 'Last name should be less than 15 characters'),
    username: yup
    .string()
    .required('Username is required ')
    .min(2, 'Username should be more than 1 character')
    .max(15, 'Username should be less than 15 characters'),
});
import * as Yup from 'yup'

export const signInSchema = Yup.object({
    email: Yup.string()
        .required('This field is required')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Incorrect email'),
    password: Yup.string()
        .required('This field is required')
        .max(50, 'Password is too long. Max 50 characters'),
}).required()

export const signUpSchema = Yup.object({
    name: Yup.string().optional(),
    email: Yup.string()
        .required('This field is required')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Incorrect email'),
    password: Yup.string()
        .required('This field is required')
        .max(50, 'Password is too long. Max 50 characters'),
})

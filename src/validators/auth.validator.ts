import { body, param } from "express-validator";

export const signupValidator = [
    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isLength({min : 6})
    .withMessage('email must be atleat 6 characters'),

    body('password')
    .isLength({min : 6})
    .withMessage('password should atleast 6 character'),

    body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min : 2})
    .withMessage('name must be atleat 2 characters'),

    body('role')
    .notEmpty()
    .withMessage('role is required')
    .isIn(['user', 'admin', 'manager'])
    .withMessage('role must be admin user or manager')
]


export const signinValidator = [
    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isLength({min : 6})
    .withMessage('email must be atleat 6 characters'),

    body('password')
    .isLength({min : 6})
    .withMessage('password should atleast 6 character'),
]


export const resetPasswordValidator = [
    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('enter a valid email'),

    body('newpassword')
    .notEmpty()
    .withMessage('new password is required')
    .isLength({min: 6})
    .withMessage('new password must be atleast 6 character')
]

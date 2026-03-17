import express, { Router } from 'express'
import { createUser, userSignin, userUpdata } from '../controller/users.controller';

const router = express.Router();

router.post('/auth/signup',createUser);
router.post('/auth/signin', userSignin);
router.patch('auth/update',userUpdata)

export default router;
import { Router } from "express";
import createUser, { AddGoogleAuthenticatedUser } from "../Controllers/UserController/createUser.js";
import login, { logout, generateRefreshToken } from '../Controllers/UserController/login.js';
import verifyUser from '../Controllers/UserController/Authenticate.js';

const userRouter = Router();
userRouter.route('/register')
        .post(createUser);
userRouter.route('/login').post(login);
userRouter.route('/oauth2/redirect/google').post(AddGoogleAuthenticatedUser)
userRouter.route('/auth').get(verifyUser);
userRouter.route('/refreshToken').post(generateRefreshToken);
userRouter.route('/logout').post(logout);

export default userRouter;
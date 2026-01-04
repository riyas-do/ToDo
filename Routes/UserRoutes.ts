import { Router } from "express";
import createUser from "../Controllers/UserController/createUser.js";

Router().route('/create')
        .post(createUser)
import { Router } from "express";
import { Register, Login, AuthenticatedUser } from "./controller/auth.controller";


export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);    
    router.post('/api/user', AuthenticatedUser);
}


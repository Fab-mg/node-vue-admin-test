import { Router } from "express";
import { authenticatedUser, Register, Login } from "./controller/auth.controller";

export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);    
    router.get('/api/user', authenticatedUser);
}


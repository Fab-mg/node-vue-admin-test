import { Router } from "express";
import { Register, Login, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword } from "./controller/auth.controller";
import { AuthMiddleware } from "./middleware/authMiddleware";


export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);    
    router.post('/api/user',AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout',AuthMiddleware, Logout);
    router.put('/api/user/updateinfo',AuthMiddleware, UpdateInfo);
    router.put('/api/user/updatepassword',AuthMiddleware, UpdatePassword);
}


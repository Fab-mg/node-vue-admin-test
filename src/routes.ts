import { Router } from "express";
import { Register, Login, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword } from "./controller/auth.controller";
import { GetPermissions } from "./controller/permission.controller";
import { CreateRole, DeleteRole, GetRoles, UpdateRole, ViewRole } from "./controller/role.controller";
import { CreateUser, DeleteUser, GetUser, UpdateUser, Users } from "./controller/user.controller";
import { AuthMiddleware } from "./middleware/authMiddleware";


export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);    
    router.post('/api/user',AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout',AuthMiddleware, Logout);
    router.put('/api/user/updateinfo',AuthMiddleware, UpdateInfo);
    router.put('/api/user/updatepassword',AuthMiddleware, UpdatePassword);

    router.get('/api/users', AuthMiddleware, Users)
    router.post('/api/createuser', AuthMiddleware, CreateUser)    
    router.get('/api/user/:id', AuthMiddleware, GetUser) 
    router.put('/api/user/:id/updateuser', AuthMiddleware, UpdateUser)
    router.delete('/api/user/:id/deleteuser', AuthMiddleware, DeleteUser)

    router.get('/api/permissions', AuthMiddleware, GetPermissions)

    router.get('/api/roles', AuthMiddleware, GetRoles)
    router.post('/api/createrole', AuthMiddleware, CreateRole)
    router.get('/api/roles/:id', AuthMiddleware, ViewRole)
    router.put('/api/roles/:id/updaterole', AuthMiddleware, UpdateRole)
    router.delete('/api/roles/:id/deleterole', AuthMiddleware, DeleteRole)
}


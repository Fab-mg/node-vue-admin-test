import { Router } from "express";
import { Register, Login, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword } from "./controller/auth.controller";
import { GetPermissions } from "./controller/permission.controller";
import { CreateProduct, DeleteProduct, GetProduct, Products, UpdateProduct } from "./controller/product.controller";
import { CreateRole, DeleteRole, GetRoles, UpdateRole, ViewRole } from "./controller/role.controller";
import { Upload } from "./controller/upload.controller";
import { CreateUser, DeleteUser, GetUser, UpdateUser, Users } from "./controller/user.controller";
import { AuthMiddleware } from "./middleware/authMiddleware";
import  express from "express"
import { Chart, ExportOrder, GetOrders } from "./controller/order.controller";
import { PermissonMiddleware } from "./middleware/permission.middleware";


export const routes = (router: Router) => {
    //AUTH
    router.post('/api/register', Register);
    router.post('/api/login', Login);    
    router.post('/api/user',AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout',AuthMiddleware, Logout);
    router.put('/api/user/updateinfo',AuthMiddleware, UpdateInfo);
    router.put('/api/user/updatepassword',AuthMiddleware, UpdatePassword);

    //USERS
    router.get('/api/users', AuthMiddleware, PermissonMiddleware('users'), Users)
    router.post('/api/createuser', AuthMiddleware, PermissonMiddleware('users'), CreateUser)    
    router.get('/api/users/:id', AuthMiddleware, PermissonMiddleware('users'), GetUser) 
    router.put('/api/users/:id/updateuser', AuthMiddleware, PermissonMiddleware('users'), UpdateUser)
    router.delete('/api/users/:id/deleteuser', AuthMiddleware, PermissonMiddleware('users'), DeleteUser)

    router.get('/api/permissions', AuthMiddleware, GetPermissions)

    //ROLES
    router.get('/api/roles', AuthMiddleware, GetRoles)
    router.post('/api/createrole', AuthMiddleware, CreateRole)
    router.get('/api/roles/:id', AuthMiddleware, ViewRole)
    router.put('/api/roles/:id/updaterole', AuthMiddleware, UpdateRole)
    router.delete('/api/roles/:id/deleterole', AuthMiddleware, DeleteRole)

    //PRODUCTS
    router.get('/api/products', AuthMiddleware, PermissonMiddleware('products'), Products)
    router.post('/api/createproduct', AuthMiddleware, PermissonMiddleware('products'), CreateProduct)
    router.get('/api/products/:id', AuthMiddleware, PermissonMiddleware('products'), GetProduct)
    router.put('/api/products/:id/updateproduct', AuthMiddleware, PermissonMiddleware('products'), UpdateProduct)
    router.delete('/api/products/:id/deleteproduct', AuthMiddleware, PermissonMiddleware('products'), DeleteProduct)

    //IMG
    router.post('/api/upload', AuthMiddleware, Upload)
    router.use('/api/uploads', express.static('./uploads'))

    //ORDERS
    router.get('/api/orders', AuthMiddleware, GetOrders)
    router.post('/api/orders/export', AuthMiddleware, ExportOrder)    
    router.get('/api/orders/chart', AuthMiddleware, Chart)
}


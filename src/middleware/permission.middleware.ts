import { Request, Response} from 'express'
import { User } from '../entity/user.entity'

export const PermissonMiddleware = (access: string) => {
    return (req: Request, res: Response, next: Function) => {
        const user : User = req['user']

        const permissions = user.role.permission        
        const viewPermission : string = "view_" + access
        const editPermission : string = "edit_" + access

        if (req.method === 'GET') {
            const viewPermission : string = "view_" + access
            const editPermission : string = "edit_" + access
//            console.log('demanded permissions = ' + viewPermission + ' ' + editPermission)
            if(!permissions.some(p =>  (p.name === viewPermission) || (p.name === editPermission))){
                return res.status(401).send({
                    message: "unauthorized"
                })
            }
        } else {
            if(!permissions.some(p =>  ( p.name === editPermission))){
                return res.status(401).send({
                    message: "unauthorized"
                })
            }
        }

        next()
    }
}
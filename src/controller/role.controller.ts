import {Request, Response} from 'express'
import { getRepository, getManager } from 'typeorm'
import { Role } from '../entity/role.entity'

export const GetRoles = async (req: Request, res: Response) => {
    const rolesRepository = getRepository(Role)
    const roles = await rolesRepository.find()

    return res.send(roles)
}

export const CreateRole = async (req: Request, res: Response) => {
    const {name} = req.body
    const permissions = req.body.permissions
    const rolesRepository = getRepository(Role)

    const roles= await rolesRepository.save({
        name: name,
        permission: permissions.map(id => ({id}))
    })

    res.status(201).send(roles)
}

export const ViewRole = async (req:Request, res: Response) => {
    const rolesRepository = getRepository(Role)
    let id : any = req.params.id

    try{
        const role = await rolesRepository.findOne( {
            where: {id: id},
            relations : { permission: true}
        })
        if(!role){
            return res.send({
                message : "Role not found"
            })
        }
        return res.send(role)
    }
    catch{
        return res.send({
            message: "Internal error"
        })
    }
}

export const UpdateRole = async (req:Request, res: Response) => {
    const rolesRepository = getManager().getRepository(Role)
    const {name, permissions} = req.body
    const Roleid : any = req.params.id

    //deleting ancient role
    try{let role = await rolesRepository.findOne( {
        where: {id: Roleid},
        relations : { permission: true}
    })

    await rolesRepository.remove(role)

    //updating new role
    const roleNew = new Role()
    roleNew.id = Roleid,
    roleNew.name = name,
    roleNew.permission = permissions.map( id => ({id}))

    await rolesRepository.save(roleNew)

    return res.status(202).send({roleNew})
}
    catch(err) {
        console.log(err)
        return res.send({
            message: "internal error"
        })
    }
}

export const DeleteRole = async (req:Request, res: Response) => {
    const repository = getRepository(Role)
    const id : any = req.params.id
    await repository.delete({id: id})
    return res.status(204).send(null)
}
import {Request, Response} from "express";
import { getManager } from "typeorm";
import { User } from '../entity/user.entity'
import bcryptjs from 'bcryptjs'

export const Users = async (req: Request,res: Response) => {
    const repository = getManager().getRepository(User)
    const users = await repository.find()

    //removing passwords
    res.send(users.map( u => {
        const {password, ...data} = u;
        return data
    }))
}

export const CreateUser = async (req: Request, res: Response) => {
    const {role_id, ...body} = req.body
    const repository = getManager().getRepository(User)
    const hashedPassword = bcryptjs.hash('1234', 10)

    const user = await repository.save({
        ...body,
        password: hashedPassword
    })
    const {password,...data} = user
    return res.status(201).send(data)
}

export const GetUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)
    const id : any = req.params.id
    try {
        const {password, ...user} = await repository.findOneBy({id: id})
        return res.send(user)
    } catch(e) {
        return res.send({
            message: "user not found"
        })
    }
}

export const UpdateUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)
    try{
        await repository.update(req.params.id, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email        
    })
    const id : any = req.params.id
    const {password, ...updatedUser} = await repository.findOneBy({id: id})
    return res.status(202).send(updatedUser)
}
    catch(e) {
        res.send({
            message: "internal error/user not found"
        })
    }

}

export const DeleteUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

        const id : any = req.params.id
        await repository.delete({id: id})
        return res.status(204).send(null)

}
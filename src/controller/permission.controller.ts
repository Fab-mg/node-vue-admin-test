import {Request, Response} from 'express'
import { getRepository } from 'typeorm'
import {Permission} from '../entity/permission.entity'

export const GetPermissions = async (req: Request, res: Response) => {
    const permRepository = getRepository(Permission)
    const perms = await permRepository.find()

    return res.send(perms)
}
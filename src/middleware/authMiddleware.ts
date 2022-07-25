import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { User } from "../entity/user.entity"

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {const jwtCookie = req.cookies['jwtCookie'];

    const payload : any = verify(jwtCookie, process.env.SECRET_KEY)

    if(!payload) {
        return  res.status(401).send({
            message: "Unauthenticated"
        })
    }

    const repository = getManager().getRepository(User);
    const {password,...authUser} = await repository.findOne({
        where : {id: payload.id},
        relations: ['role', 'role.permission']
    }) 
    
    req["user"] = authUser;

    next();
}
    catch (e) {
        return  res.status(401).send({
            message: "Unauthenticated"
        })
    }
}
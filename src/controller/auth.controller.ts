import { Request, Response } from "express"
import { getManager } from "typeorm";
import { registerValidation } from "../validation/register.validation";
import {User} from "../entity/user.entity";
import bcryptjs from "bcryptjs"
import { sign, verify} from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
    const body = req.body;

    const bodycheck = registerValidation.validate(body);

    //check the body
    //catch error if any (400) error status

    if(bodycheck.error) {
        return res.status(400).send(bodycheck.error.details);
    }

    if(body.password !== body.password_confirm) {
        return res.status(400).send({
            message: "Password do not match"
        }
        );
    }

    const repository = getManager().getRepository(User);

    const {password, ...user} = await repository.save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 10) 
    })

    res.send(user);
}

export const Login = async (req: Request, res: Response) => {
    const body = req.body
    const repository = getManager().getRepository(User)
    const user = await repository.findOneBy({email: body.email})

    if(!user) {
        return res.status(404).send({
            message: "User not found"
        })
    }

    if(!await bcryptjs.compare(body.password, user.password)){
        return res.status(400).send({
            message: "Invalid credentials"
        })
    }

    // const payload = {
    //     id : user.id,
    //     name: user.first_name
    // }
    
    const {password, ...payload2} = user;
    const token = sign(payload2, process.env.SECRET_KEY);

    res.cookie('jwtCookie', token, {
        httpOnly: true, // accessible only to the back end, more secure
        maxAge: 24*60*60*1000 // 1 day
    } )

    res.send({
        message: "Loggin successfully"
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    return res.send(req["user"]) //user is parsed in the authMiddleware
}

export const Logout = async (req: Request, res: Response) => {
    const jwtCookie = res.cookie('jwtCookie', {
        maxAge: 0
    })

    return res.send({
        message: "Logout successfully"
    })
}

export const UpdateInfo = async (req: Request, res: Response) => {
    const body = req.body;

    const bodycheck = registerValidation.validate(body);

    //check the body
    //catch error if any (400) error status

    if(bodycheck.error) {
        return res.status(400).send(bodycheck.error.details);
    }

    const user = req['user']
    const repository = getManager().getRepository(User)
    await repository.update(user.id, {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email
    })

    const {password,...data} = await repository.findOneBy({id: user.id})
    return res.send(data)
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req['user']
    const body = req.body

    if(body.password !== body.password_confirm) {
        return res.status(400).send({
            message: "Password do not match"
        }
        );
    }

    const repository = getManager().getRepository(User)
    await repository.update(user.id, {
        password: await bcryptjs.hash(body.password, 10)
    })

    const /*{password,...data}*/ data = await repository.findOneBy({id: user.id})
    return res.send(data)
}
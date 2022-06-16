import { Request, Response } from "express"
import { getManager } from "typeorm";
import { registerValidation } from "../validation/register.validation";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";

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
 
    const repository = getManager().getRepository(User)

    const {password, ...user} = await repository.save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 10)
    })

    res.send(user);
} 

export const Login = async (req: Request, res: Response) => {

    const repository = getManager().getRepository(User);

    //const user = await repository.findOne({where:   {email: req.body.email}     });
    const user = await repository.findOneBy({email: req.body.email});

    if(!user) {
        return res.status(404).send({
            message: "Invalid credentials"
        })
    }

    if(!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: "Invalid credentials"
        })
    }

    const payload = {
        id: user.id
    }
    const token = sign(payload, "secret")

    res.cookie('jwt', token, {
        httpOnly: true, //only accessible by the backend, more secure
        maxAge: 24*60*60*1000 //one day
    })

 //   const {password, ...data} = user

    res.send({
        message: "success"
    });

}


export const authenticatedUser = async (req: Request, res: Response) => {
    const jwt = req.cookies['jwt'];

    //using the cookie
    const payload: any = verify(jwt, "secret") // secret is the keyword used when creating the token
    if (!payload) {
        return res.status(401).send({
            message: "User not authenticated"
        })
    }
    const repository = getManager().getRepository(User);

    const {password, ...user} = await repository.findOneBy({id: payload.id})

    res.send(user)
}
import { Request, Response } from "express"
import { registerValidation } from "../validation/register.validation";

export const Register = (req: Request, res: Response) => {
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
    res.send(body); //returns body from request
}
import {Request, Response} from "express";
import { getManager } from "typeorm";
import { Product } from "../entity/product.entity";

export const Products = async (req: Request,res: Response) => {
    const repository = getManager().getRepository(Product)
    const products = await repository.find()

    //removing passwords
    res.send(products)
}

export const CreateProduct = async (req: Request, res: Response) => {
    const body = req.body
    const repository = getManager().getRepository(Product)

    const product = new Product()
    product.title = body.title
    product.description = body.description
    product.image = body.image
    product.price = body.price

    await repository.save(product)
    return res.status(201).send(product)
}

export const GetProduct = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Product)
    const id : any = req.params.id
    try {
        const product = await repository.findOne({ where: {id: id}})
        return res.send(product)
    } catch(e) {
        console.log(e)
        return res.send({
            message: "product not found"
        })
    }
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Product)
    try{
        await repository.update(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image       
    })
    const id : any = req.params.id
    const product = await repository.findOne({where: {id: id}})
    return res.status(202).send(product)
}
    catch(e) {
        console.log(e)
        res.send({
            message: "internal error"
        })
    }

}

export const DeleteProduct = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Product)

        const id : any = req.params.id
        await repository.delete({id: id})
        return res.status(204).send(null)

}
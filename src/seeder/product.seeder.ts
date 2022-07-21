import { createConnection, getRepository } from "typeorm";
import { Products } from "../controller/product.controller";
import { faker } from '@faker-js/faker';
import { randomInt } from "crypto";
import { Product } from "../entity/product.entity";

createConnection().then(async  connection => {
    const repository = getRepository(Product)

    for (let i = 0; i < 30; i++){
        let product = new Product()
        product.title= faker.commerce.product(),
        product.description= faker.lorem.paragraph(),
        product.image= faker.image.business(200,200,true),
        product.price= randomInt(10, 70)
        
        await repository.save(product)
    }
   process.exit(0) 
})
    
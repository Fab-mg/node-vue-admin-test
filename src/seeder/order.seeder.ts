import { createConnection, getRepository } from "typeorm";
import { Products } from "../controller/product.controller";
import { faker } from '@faker-js/faker';
import { randomInt } from "crypto";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/order-items.entity";

createConnection().then(async  connection => {
    const repository = getRepository(Order)
    const itemrepository = getRepository(OrderItem)

    for (let i = 0; i < 30; i++){
        let order = new Order()
        order.first_name= faker.name.firstName(),
        order.last_name= faker.name.lastName(),
        order.email= faker.internet.email(),
       // order.price= randomInt(10, 70)

       await repository.save(order)

       for (let j = 0; j < randomInt(1, 5); j++){
        let item = new OrderItem()
        item.order = order
        item.product_title = faker.commerce.product()
        item.price = randomInt(30, 65)
        item.quantity = randomInt(1, 10)

        await itemrepository.save(item)
    }
    }    
    
   process.exit(0) 
})

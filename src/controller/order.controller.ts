import {Request, Response} from 'express'
import { Parser } from 'json2csv'
import { json } from 'stream/consumers'
import { getManager, getRepository } from 'typeorm'
import { OrderItem } from '../entity/order-items.entity'
import { Order } from '../entity/order.entity'
import parser  from 'json2csv'

export const GetOrders = async (req: Request, res: Response) => {
    const repository = getRepository(Order)
    const itemNumber = 5
    const page = parseInt(req.query.page as string || '1')

    const [data, total] = await repository.findAndCount({
        take: itemNumber,
        skip: (page - 1)*itemNumber,
        relations: ['order_items']
    })

    res.send({
        data: data.map((order: Order) => ({
            id: order.id,    
            name: order.name,
            email: order.email,
            total: order.total,
            date: order.created_at,
            order_items: order.order_items
        })) ,
        meta: {
            total,
            page, //current page
            last_page: Math.ceil(total/itemNumber) //calculating page
        }
    })
}

export const ExportOrder = async (req:Request, res:Response) => {
    const paser = new Parser({
        fields: ['ID', 'NAME', 'EMAIL', 'PRODUCT TITLE', 'PRICE', 'QUANTITY']
    })
     const repository = getRepository(Order)

     const orders = await repository.find( {relations: ['order_items']})

     let json = []

     orders.forEach((order: Order) => {
        json.push({
            ID : order.id,
            NAME : order.name,
            EMAIL : order.email,
            'PRODUCT TITLE': '',
            PRICE: '',
            QUANTITY: ''
        })

        order.order_items.forEach((item: OrderItem) => { json.push({
            ID : '',
            NAME : '',
            EMAIL : '',
            'PRODUCT TITLE': item.product_title,
            PRICE: item.price,
            QUANTITY: item.quantity
        })})
     })
     const csv = parser.parse(json)
     res.header('Content-Type', 'text/csv')
     res.attachment('Orders.csv')
     res.send(csv)
}

export const Chart = async (req: Request , res: Response) => {
    const manager = getManager()
    const result = await manager.query("SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, SUM(oi.price * oi.quantity) as sum" +
       " FROM `order` o" +
       " JOIN order_item oi on o.id = oi.orderId " +
       " GROUP BY date;")

    res.send(result)
}

// SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, SUM(oi.price * oi.quantity) as sum
//         FROM `order` o
//         JOIN order_item oi on o.id = oi.orderId 
//         GROUP BY date;
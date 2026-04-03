import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }


    @Get('user/:user_id')
    async getOrders(@Param('user_id') user_id: string) {
        return this.ordersService.getOrders(Number(user_id));
    }

    @Get(':id')
    async getOrder(@Param('id') id: string) {
        return this.ordersService.getOrder(Number(id));
    }

    @Post()
    async createOrder(
        @Body() data: { user_id: number, cart_id: number, address: string },
    ) {
        return this.ordersService.createOrder(data.user_id, data.cart_id, data.address);
    }

}

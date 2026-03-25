
import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    async addToCart(
        @Body() data: { user_id: number, product_id: number, quantity: number },
    ) {
        return this.cartService.addToCart(data.user_id, data.product_id, data.quantity);
    }

    @Get(':user_id')
    async getCart(@Param('user_id') user_id: string) {
        return this.cartService.getCart(Number(user_id));
    }

    @Patch('item/:id')
    async updateCartItem(@Param('id') id: string, @Body() data: { quantity: number }) {
        return this.cartService.updateCartItem(Number(id), data.quantity);
    }

    @Delete('item/:id')
    async removeCartItem(@Param('id') id: string) {
        return this.cartService.removeCartItem(Number(id));
    }
}
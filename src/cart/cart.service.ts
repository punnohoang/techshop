import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CartService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async addToCart(user_id: number, product_id: number, quantity: number) {
        // Bước 1: kiểm tra giỏ hàng
        const cartResult = await this.pool.query('SELECT * FROM carts WHERE user_id = $1 AND status = \'active\'', [user_id]);
        // Bước 2: tạo mới nếu chưa có
        let cart = cartResult.rows[0];
        if (!cart) {
            const newCartResult = await this.pool.query('INSERT INTO carts (user_id, status) VALUES ($1, \'active\') RETURNING *', [user_id]);
            cart = newCartResult.rows[0];
        }
        // Bước 3: thêm sản phẩm
        const item = await this.pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [cart.id, product_id, quantity]);
        return item.rows[0];
    }

    async getCart(user_id: number) {
        const cartResult = await this.pool.query('SELECT * FROM carts WHERE user_id = $1 AND status = \'active\'', [user_id]);
        const cart = cartResult.rows[0];
        if (!cart) {
            return { items: [] };
        }
        const itemsResult = await this.pool.query(`
            SELECT cart_items.*, products.name, products.price, products.image_url
            FROM cart_items
            JOIN carts ON cart_items.cart_id = carts.id
            JOIN products ON cart_items.product_id = products.id
            WHERE carts.user_id = $1
        `, [user_id]);
        return { items: itemsResult.rows };
    }

    async updateCartItem(cart_item_id: number, quantity: number) {
        const result = await this.pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *', [quantity, cart_item_id]);
        return result.rows[0];
    }

    async removeCartItem(cart_item_id: number) {
        await this.pool.query('DELETE FROM cart_items WHERE id = $1', [cart_item_id]);
        return { success: true };
    }
}

import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class OrdersService {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async createOrder(user_id: number, cart_id: number, address: string) {
        // Bước 2: lấy sản phẩm từ giỏ hàng
        const itemsResult = await this.pool.query(`
            SELECT cart_items.*, products.name, products.price
            FROM cart_items
            JOIN carts ON cart_items.cart_id = carts.id
            JOIN products ON cart_items.product_id = products.id
            WHERE carts.id = $1
        `, [cart_id]);
        const items = itemsResult.rows;
        // Tính tổng tiền
        const total_price = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        // Bước 1: tạo đơn hàng
        const orderResult = await this.pool.query('INSERT INTO orders (user_id, status, address, total_price) VALUES ($1, \'pending\', $2, $3) RETURNING *', [user_id, address, total_price]);
        const order = orderResult.rows[0];

        // Bước 3: thêm sản phẩm vào đơn hàng
        for (const item of items) {
            await this.pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [order.id, item.product_id, item.quantity, item.price]);
        }
        // Bước 4: cập nhật trạng thái giỏ hàng
        await this.pool.query('UPDATE carts SET status = \'ordered\' WHERE id = $1', [cart_id]);
        return order;
    }

    // Xem tất cả đơn hàng của user
    async getOrders(user_id: number) {
        const ordersResult = await this.pool.query('SELECT * FROM orders WHERE user_id = $1', [user_id]);
        return ordersResult.rows;
    }

    // Xem chi tiết 1 đơn hàng kèm sản phẩm
    async getOrder(order_id: number) {
        const orderResult = await this.pool.query('SELECT * FROM orders WHERE id = $1', [order_id]);
        const order = orderResult.rows[0];
        const itemsResult = await this.pool.query(`
        SELECT order_items.*, products.name, products.image_url
        FROM order_items
        JOIN products ON order_items.product_id = products.id
        WHERE order_items.order_id = $1
    `, [order_id]);
        order.items = itemsResult.rows;
        return order;
    }
}

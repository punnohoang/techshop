import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
  @Inject('DATABASE_POOL') private pool: Pool,
  private cloudinaryService: CloudinaryService
) {}
  
  async getAll() {
    const result = await this.pool.query('SELECT * FROM products');
    return result.rows;
  }

  async getOne(id: number) {
  const result = await this.pool.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );
  
  return result.rows[0];
  }

  async create(data: { name: string, price: number, description: string, year: number, stock: number }, file?: Express.Multer.File) {

    let image_url = '';

    if (file) {
      image_url = await this.cloudinaryService.uploadImage(file);
    }

    const result = await this.pool.query(
      'INSERT INTO products (name, price, description, year, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.name, data.price, data.description, data.year, image_url, data.stock]
    );
    return result.rows[0];
  }

  async update (id : number , data : { name ?: string, price?: number, description?: string, year?: number, image_url?: string ,stock?: number}){

    const result = await this.pool.query(
      'UPDATE products SET name=$1, price =$2, description=$3, year=$4, image_url=$5, stock=$6 WHERE id = $7 RETURNING *',
      [data.name, data.price, data.description, data.year, data.image_url, data.stock, id]
    );
    return result.rows[0];
  }

  async delete (id : number){
    const result = await this.pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}
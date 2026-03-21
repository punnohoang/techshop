import { Controller, Get, Param, Post, Body,Patch , Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll() {
    return this.productsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string){
    return this.productsService.getOne(Number(id));
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() data: {name: string, price: number, description: string, year: number, stock: number },
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.productsService.create(data, file);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name ?: string, price?: number, description?: string, year?: number, image_url?: string ,stock?: number }){
    return this.productsService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string){
    return this.productsService.delete(Number(id));
  }

  
}
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: 'DATABASE_POOL', useValue: { query: jest.fn() } },
        { provide: CloudinaryService, useValue: { uploadImage: jest.fn() } },
      ],
    }).compile();
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './DTOs/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  // CREATE
  async create(tenantId: string, dto: CreateProductDto) {
    return this.productModel.create({
      ...dto,
      tenant: new Types.ObjectId(tenantId),
    });
  }

  // GET ALL (Aggregation with filters + pagination)
  async findAll(tenantId: string, query: any) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const pipeline: any[] = [];

    // Tenant isolation
    pipeline.push({
      $match: {
        tenant: new Types.ObjectId(tenantId),
      },
    });

    // Search
    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: 'i' },
        },
      });
    }

    // Category filter
    if (category) {
      pipeline.push({
        $match: { category },
      });
    }

    // Price filter
    if (minPrice || maxPrice) {
      pipeline.push({
        $match: {
          price: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
      });
    }

    // Sorting
    pipeline.push({
      $sort: {
        [sortBy]: order === 'asc' ? 1 : -1,
      },
    });

    // Pagination using FACET (best practice)
    pipeline.push({
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: Number(limit) },
        ],
        totalCount: [{ $count: 'count' }],
      },
    });

    return this.productModel.aggregate(pipeline);
  }

  // GET SINGLE
  async findOne(tenantId: string, id: string) {
    const product = await this.productModel.findOne({
      _id: id,
      tenant: tenantId,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  // UPDATE
  async update(tenantId: string, id: string, dto: any) {
    const product = await this.productModel.findOneAndUpdate(
      { _id: id, tenant: tenantId },
      dto,
      { new: true },
    );

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  // DELETE (soft delete better)
  async remove(tenantId: string, id: string) {
    const product = await this.productModel.findOneAndUpdate(
      { _id: id, tenant: tenantId },
      { isActive: false },
      { new: true },
    );

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
}
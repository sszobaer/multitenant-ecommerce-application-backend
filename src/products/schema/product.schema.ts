import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;
@Schema({timestamps: true})
export class Product {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenant!: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
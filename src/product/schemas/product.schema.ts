import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

// Product Model Schema Properties

@Schema()
export class Product {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop()
    category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
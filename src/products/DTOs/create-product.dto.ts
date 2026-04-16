import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Name is required' })
    name!: string;

    @IsNotEmpty({ message: 'Price is required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Price must be a number' })
    price!: number;
}
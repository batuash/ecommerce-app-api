import { IsEmail, IsString, IsArray, ValidateNested, IsNumber, IsOptional, IsEnum, Min, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaymentMethod } from '../../models/payment.entity';
import { ShippingMethod } from '../../models/shipping.entity';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateShippingDto {
  @IsEnum(ShippingMethod)
  method: ShippingMethod;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value === undefined ? null : value)
  email?: string;
}

export class CreatePaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  lastFourDigits?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  cardBrand?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  expiryMonth?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  expiryYear?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingFirstName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingLastName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingAddressLine1?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingAddressLine2?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingCity?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingState?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingPostalCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  billingCountry?: string;
}

export class CreateOrderDto {
  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  customerName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  customerPhone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  @ValidateNested()
  @Type(() => CreateShippingDto)
  shipping: CreateShippingDto;

  @ValidateNested()
  @Type(() => CreatePaymentDto)
  payment: CreatePaymentDto;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === undefined ? null : value)
  notes?: string;
}

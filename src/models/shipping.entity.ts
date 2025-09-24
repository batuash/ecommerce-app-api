import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
  PICKUP = 'pickup',
}

export enum ShippingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

@Entity('shipping')
export class Shipping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  orderId: string;

  @Column({ type: 'enum', enum: ShippingMethod, default: ShippingMethod.STANDARD })
  method: ShippingMethod;

  @Column({ type: 'enum', enum: ShippingStatus, default: ShippingStatus.PENDING })
  status: ShippingStatus;

  // Shipping Address
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressLine2: string | null;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 20 })
  postalCode: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  // Shipping Details
  @Column({ type: 'varchar', length: 100, nullable: true })
  carrier: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string | null;

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  shippedDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  deliveredDate: Date | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  weightUnit: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Order, (order) => order.shipping, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}

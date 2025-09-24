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

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CHECK = 'check',
  CRYPTOCURRENCY = 'cryptocurrency',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  orderId: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  // Payment Gateway Information
  @Column({ type: 'varchar', length: 255, nullable: true })
  gatewayTransactionId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gatewayReference: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gatewayName: string | null;

  // Card Information (encrypted or masked)
  @Column({ type: 'varchar', length: 4, nullable: true })
  lastFourDigits: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cardBrand: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  expiryMonth: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  expiryYear: string | null;

  // Billing Address
  @Column({ type: 'varchar', length: 100, nullable: true })
  billingFirstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingLastName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  billingAddressLine1: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  billingAddressLine2: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingCity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingState: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  billingPostalCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  billingCountry: string | null;

  // Payment Processing Details
  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  failureReason: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  refundReason: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Order, (order) => order.payment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}

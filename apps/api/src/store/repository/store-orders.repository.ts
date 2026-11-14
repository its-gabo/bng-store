import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual } from 'typeorm';

import { ORDER_STATUSES } from '../constants/store.constants';
import { OrderItemEntity } from '../db/order-item.entity';
import { OrderEntity } from '../db/order.entity';

import type {
  CreateOrderParams,
  OrderStatus,
  PaymentProvider,
  PricedOrderItem,
} from '../types/store.types';
import type { EntityManager } from 'typeorm';

@Injectable()
export class StoreOrdersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async transaction<T>(
    work: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(work);
  }

  async createOrder(
    params: CreateOrderParams,
    manager: EntityManager,
  ): Promise<OrderEntity> {
    const {
      userId,
      kind,
      subscriptionId,
      status,
      pricedSelection,
      payment,
      expiresAt,
      paidAt,
    } = params;

    return manager.save(
      manager.create(OrderEntity, {
        userId,
        kind,
        subscriptionId,
        status,
        selection: pricedSelection.selection,
        bundleId: pricedSelection.bundleId,
        billingPeriod: pricedSelection.billingPeriod,
        totalAmountMinor: pricedSelection.totalAmountMinor,
        currency: pricedSelection.currency,
        paymentProvider: payment.paymentProvider,
        paymentReference: payment.paymentReference,
        expiresAt,
        paidAt,
      }),
    );
  }

  async createOrderItems(
    orderId: string,
    items: PricedOrderItem[],
    manager: EntityManager,
  ): Promise<void> {
    if (items.length === 0) return;

    await manager.insert(
      OrderItemEntity,
      items.map(({ applicationId, unitAmountMinor }) => ({
        orderId,
        applicationId,
        unitAmountMinor,
      })),
    );
  }

  async findOrderItems(
    orderId: string,
    manager: EntityManager,
  ): Promise<OrderItemEntity[]> {
    return manager.findBy(OrderItemEntity, { orderId });
  }

  async lockOrderByPaymentReference(
    params: { paymentProvider: PaymentProvider; paymentReference: string },
    manager: EntityManager,
  ): Promise<OrderEntity | null> {
    const { paymentProvider, paymentReference } = params;

    return manager.findOne(OrderEntity, {
      where: { paymentProvider, paymentReference },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async markOrderPaid(
    params: { orderId: string; paidAt: Date },
    manager: EntityManager,
  ): Promise<void> {
    const { orderId, paidAt } = params;

    await manager.update(
      OrderEntity,
      { id: orderId },
      { status: ORDER_STATUSES.PAID, paidAt },
    );
  }

  async updateOrderStatus(
    params: { orderId: string; status: OrderStatus },
    manager: EntityManager,
  ): Promise<void> {
    const { orderId, status } = params;

    await manager.update(OrderEntity, { id: orderId }, { status });
  }

  async findLatestPaidOrderOfSubscription(
    params: { subscriptionId: string; purchaseOrderId: string },
    manager: EntityManager,
  ): Promise<OrderEntity | null> {
    const { subscriptionId, purchaseOrderId } = params;

    return manager.findOne(OrderEntity, {
      where: [
        { subscriptionId, status: ORDER_STATUSES.PAID },
        { id: purchaseOrderId, status: ORDER_STATUSES.PAID },
      ],
      relations: { items: true },
      order: { paidAt: 'DESC' },
    });
  }

  async expirePendingOrders(now: Date): Promise<number> {
    const result = await this.dataSource.manager.update(
      OrderEntity,
      { status: ORDER_STATUSES.PENDING, expiresAt: LessThanOrEqual(now) },
      { status: ORDER_STATUSES.EXPIRED },
    );

    return result.affected ?? 0;
  }
}

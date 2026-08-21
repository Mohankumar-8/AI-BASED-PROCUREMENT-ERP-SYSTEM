import { db } from '../db/database';
import { InventoryItem, InventoryMovement } from '../types/backendTypes';

export class InventoryService {
  public static getAll(): InventoryItem[] {
    return db.getInventory();
  }

  public static getMovements(): InventoryMovement[] {
    return db.getInventoryMovements();
  }

  /**
   * Registers incoming stock when a Purchase Order is issued / approved
   */
  public static registerInboundPo(
    sku: string,
    quantity: number,
    poNumber: string,
    itemName?: string
  ): InventoryItem {
    let item = db.getInventoryItemBySku(sku);

    if (item) {
      const updatedIncoming = item.incomingStock + quantity;
      const updatedPendingPo = item.pendingPoQuantity + quantity;
      const updated = db.updateInventoryItem(item.id, {
        incomingStock: updatedIncoming,
        pendingPoQuantity: updatedPendingPo,
        status: updatedIncoming + item.currentStock >= item.reorderLevel ? 'optimal' : item.status,
        lastReorderDate: new Date().toISOString().split('T')[0],
      });
      return updated!;
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        sku,
        name: itemName || sku,
        category: 'IT Hardware',
        currentStock: 0,
        incomingStock: quantity,
        reorderLevel: Math.round(quantity * 0.3),
        safetyStock: Math.round(quantity * 0.1),
        unit: 'Units',
        unitCost: 48000,
        warehouseLocation: 'Bay 4A - IT Warehouse',
        status: 'optimal',
        lastReorderDate: new Date().toISOString().split('T')[0],
        pendingPoQuantity: quantity,
      };
      db.updateInventoryItem(newItem.id, newItem);
      return newItem;
    }
  }

  /**
   * Processes a Goods Receipt Note (GRN) when physical shipments arrive at the warehouse
   */
  public static processGoodsReceipt(
    skuOrItemId: string,
    receivedQuantity: number,
    poNumber: string,
    warehouseLocation: string = 'Bay 4A - Whitefield Central Hub',
    actorName: string = 'Warehouse Incharge'
  ): { item: InventoryItem; movement: InventoryMovement } {
    let item = db.getInventoryItemById(skuOrItemId) || db.getInventoryItemBySku(skuOrItemId);

    if (!item) {
      throw new Error(`Inventory item '${skuOrItemId}' not found`);
    }

    const newIncoming = Math.max(0, item.incomingStock - receivedQuantity);
    const newCurrent = item.currentStock + receivedQuantity;
    const newPending = Math.max(0, item.pendingPoQuantity - receivedQuantity);

    const updatedItem = db.updateInventoryItem(item.id, {
      currentStock: newCurrent,
      incomingStock: newIncoming,
      pendingPoQuantity: newPending,
      status: newCurrent >= item.reorderLevel ? 'optimal' : 'low_stock',
    })!;

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      sku: item.sku,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'Inbound Receipt',
      quantity: receivedQuantity,
      unit: item.unit,
      referencePo: poNumber,
      warehouseLocation,
      actor: actorName,
    };

    db.addInventoryMovement(movement);

    return { item: updatedItem, movement };
  }
}

import { OrderItem } from "../models/orderItem.js";

// GET /api/orderitems — всі item-и всіх замовлень
export const getOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll();
    res.json(items);
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ message: "Error fetching order items" });
  }
};

// GET /api/orderitems/:id — один item
export const getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "OrderItem not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching order item:", error);
    res.status(500).json({ message: "Error fetching order item" });
  }
};

// POST /api/orderitems — створити item
export const createOrderItem = async (req, res) => {
  try {
    const { orderid, menuitemid, quantity, subtotal } = req.body;

    const newItem = await OrderItem.create({
      orderid,
      menuitemid,
      quantity,
      subtotal,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(400).json({ message: "Error creating order item" });
  }
};

// PUT /api/orderitems/:id — оновити item
export const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderid, menuitemid, quantity, subtotal } = req.body;

    const item = await OrderItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "OrderItem not found" });
    }

    await item.update({
      orderid: orderid ?? item.orderid,
      menuitemid: menuitemid ?? item.menuitemid,
      quantity: quantity ?? item.quantity,
      subtotal: subtotal ?? item.subtotal,
    });

    res.json(item);
  } catch (error) {
    console.error("Error updating order item:", error);
    res.status(500).json({ message: "Error updating order item" });
  }
};

// DELETE /api/orderitems/:id — видалити item
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await OrderItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "OrderItem not found" });
    }

    await item.destroy();
    res.json({ message: "OrderItem deleted" });
  } catch (error) {
    console.error("Error deleting order item:", error);
    res.status(500).json({ message: "Error deleting order item" });
  }
};

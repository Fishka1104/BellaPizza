// controllers/ordersController.js
import { Order } from "../models/order.js";

// GET /api/orders — отримати всі замовлення
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// GET /api/orders/:id — отримати одне замовлення
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// POST /api/orders — створити замовлення
export const createOrder = async (req, res) => {
  try {
    const {
      userid,
      orderdate,
      totalamount,
      status,
      paymentmethod,
      deliveryaddress,
    } = req.body;

    const newOrder = await Order.create({
      userid,
      orderdate,
      totalamount,
      status,
      paymentmethod,
      deliveryaddress,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: "Error creating order" });
  }
};

// PUT /api/orders/:id — оновити замовлення
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userid,
      orderdate,
      totalamount,
      status,
      paymentmethod,
      deliveryaddress,
    } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({
      userid: userid ?? order.userid,
      orderdate: orderdate ?? order.orderdate,
      totalamount: totalamount ?? order.totalamount,
      status: status ?? order.status,
      paymentmethod: paymentmethod ?? order.paymentmethod,
      deliveryaddress: deliveryaddress ?? order.deliveryaddress,
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
};

// DELETE /api/orders/:id — видалити замовлення
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.destroy();
    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};

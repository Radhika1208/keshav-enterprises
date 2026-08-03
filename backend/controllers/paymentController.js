import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";

const getRazorpayInstance = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// @desc  Create a Razorpay order for an existing order
// @route POST /api/payments/razorpay/order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this order");
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const razorpay = getRazorpayInstance();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100), // in paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.paymentResult = { ...order.paymentResult, razorpayOrderId: razorpayOrder.id, status: "created" };
  await order.save();

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc  Verify Razorpay payment signature after checkout
// @route POST /api/payments/razorpay/verify
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed - signature mismatch");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = "processing";
  order.paymentResult = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: "paid",
  };

  const updated = await order.save();
  res.json(updated);
});

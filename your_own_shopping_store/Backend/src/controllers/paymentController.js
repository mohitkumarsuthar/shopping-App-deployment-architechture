import Razorpay from "razorpay"
import dotenv from "dotenv"
import { Order } from "../models/Order.js"
import crypto from "crypto"


dotenv.config()



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})


export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body
    const userId = req.user.id

    const order = await Order.create({
      userId,
      totalAmount: amount,
      paymentMethod: "ONLINE",
      paymentStatus: "PENDING",
      address: "TEMP_ADDRESS" // replace later with real value
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: order.id,
    })

    await order.update({ razorpayOrderId: razorpayOrder.id })

    res.json({ razorpayOrder })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Order creation failed" })
  }
}


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    res.status(200).json({ message: "Payment verified successfully" })
  } catch (err) {
    console.error("Payment verification failed:", err)
    res.status(400).json({ message: "Payment verification failed", error: err.message })
  }
}



export const razorpayWebhook = async (req, res) => {
  console.log("🔔 Razorpay Webhook Received")
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  const signature = req.headers["x-razorpay-signature"]
  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex")

  if (signature !== expected) {
    return res.status(400).json({ message: "Invalid signature" })
  }

  const event = JSON.parse(req.body.toString())

  if (event.event === "payment.captured") {
    const razorpayOrderId = event.payload.payment.entity.order_id

    const order = await Order.findOne({ where: { razorpayOrderId } })

    if (order) {
      await order.update({ paymentStatus: "PAID", status: "PROCESSING" })
    }
  }
  console.log("Event:", event.event)
  res.json({ status: "ok" })
}
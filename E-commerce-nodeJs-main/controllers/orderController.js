const Order = require("../models/Order");
const Product = require("../models/Product");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const Razorpay = require("razorpay");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const razorpay = new Razorpay({
  key_id: "rzp_test_uiuLy9EqinpEBV",
  key_secret: "o8y2JICpIeCXEOWvnc3sY0v3",
});
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id : ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ email: req.query.email });
  res.status(StatusCodes.OK).json(orders);
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  order.status = req.body.status;
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

const addOrder = async (req, res) => {
  const amount = req.body.items.reduce(
    (acc, item) => acc + item.totalAmount,
    0
  );

  const options = {
    amount: amount*100,
    currency: "INR",
    receipt: ""+Math.round(Math.random() * 10000000),
    payment_capture: 1,
  };
  try {
    const razorOrder = await razorpay.orders.create(options);

    res.json({
      order_id: razorOrder.id,
      currency: razorOrder.currency,
      amount: razorOrder.amount,
    });
  } catch (error) {
  
    res.status(400).send("Not able to create order")
  }
  //   const data = await Order.insertMany(req.body.items);
  //   res.json(data);
};

const finishOrder = async(req,res)=>{
    for(let i=0;i<req.body.length;i++)
    {
        const item = req.body[i];
        let product = await Product.findOne({_id:item.productId})

        if (product.inventory-item.quantity > 0) {
            // Reduce the quantity of the product
            product.inventory -= item.quantity;
            // Save the updated product
            await product.save();

            // Now you can proceed with the rest of your logic
        }
        else
        {
            res.status(StatusCodes.BAD_REQUEST).send("one or more item is out of stock")
        }

    }

    const data = await Order.insertMany(req.body)
    console.log(data)
    res.json(data);
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  addOrder,
  finishOrder
};

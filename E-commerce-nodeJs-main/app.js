require('dotenv').config();
require('express-async-errors');
// express
const Product = require("./models/Product")
const express = require('express');
const app = express();
// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const fs = require('fs')
const Filter = require("./models/Filter")
// database
const connectDB = require('./db/connect');

//  routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const filterRouter = require("./routes/filterRoutes")
const addressRouter = require("./routes/addressRoutes");
const cartRouter = require("./routes/cartRoutes")
// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);


app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 6000,
  })
);

app.use(helmet());
const corsOptions = {
    origin: ['https://ecommerce-jitendra.netlify.app', 'http://localhost:5174', 'http://localhost:5173'], // Replace with your frontend domain
    credentials: true, // Enable credentials (cookies, authorization headers)
  };

app.use(cors(corsOptions));

app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use("/api/v1/filters",filterRouter)
app.use("/api/v1/address",addressRouter)
app.use("/api/v1/cart",cartRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

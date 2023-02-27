import express from 'express';
import 'express-async-errors';
// import errorMiddleware from './middlewares/Error';
import { productRouter, userRouter, orderRouter } from './routes';

const app = express();

app.use(express.json());

// app.use(errorMiddleware);

app.use('/products', productRouter);

app.use('/users', userRouter);

app.use('/orders', orderRouter);

export default app;
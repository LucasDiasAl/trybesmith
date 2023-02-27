import express from 'express';
import 'express-async-errors';
import { productRouter, userRouter, orderRouter, loginRouter } from './routes';

const app = express();

app.use(express.json());

app.use('/products', productRouter);

app.use('/users', userRouter);

app.use('/orders', orderRouter);

app.use('/login', loginRouter);

export default app;
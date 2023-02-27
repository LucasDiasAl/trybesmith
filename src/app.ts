import express from 'express';
import 'express-async-errors';
// import errorMiddleware from './middlewares/Error';
import { productRouter, userRouter } from './routes';

const app = express();

app.use(express.json());

// app.use(errorMiddleware);

app.use('/products', productRouter);

app.use('/users', userRouter);

export default app;
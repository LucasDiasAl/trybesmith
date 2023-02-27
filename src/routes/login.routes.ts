import { Router } from 'express';
import LoginController from '../controllers/login.controller';
import LoginMiddleware from '../middlewares/login.validation';

const router = Router();

const loginController = new LoginController();
const loginMiddleware = new LoginMiddleware();

router.post('/', loginMiddleware.loginValidation, loginController.login);
export default router;
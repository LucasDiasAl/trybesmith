import { Router } from 'express';
import UserController from '../controllers/user.controller';
import UserValidation from '../middlewares/user.validation';

const userController = new UserController();
const userValidation = new UserValidation();
const router = Router();

router.post(
  '/', 
  userValidation.userValidation,

  userController.createUser,
);

export default router;
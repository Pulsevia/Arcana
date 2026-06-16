import express from 'express';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
} from '../controllers/user.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { registerUserSchema, loginUserSchema } from '../validations/user.validations';

const router = express.Router();

router.post('/register', validateRequest(registerUserSchema), registerUser);
router.post('/login', validateRequest(loginUserSchema), loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;

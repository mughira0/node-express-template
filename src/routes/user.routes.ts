import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All user routes require a valid JWT
router.use(authenticate);

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', authorize('admin'), UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', authorize('admin'), UserController.deleteUser);

export default router;

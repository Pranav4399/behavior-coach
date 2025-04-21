import express from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../../auth/middleware/authMiddleware';
import { authorize } from '../../auth/middleware/authMiddleware';

const router = express.Router();
const userController = new UserController();

// User management routes - require auth and proper permissions
router.get(
  '/',
  authMiddleware,
  authorize(['user:view']),
  userController.getAllUsers.bind(userController)
);

router.post(
  '/',
  authMiddleware,
  authorize(['user:create']),
  userController.inviteUser.bind(userController)
);

router.get(
  '/:userId',
  authMiddleware,
  authorize(['user:view']),
  userController.getUserById.bind(userController)
);

router.patch(
  '/:userId',
  authMiddleware,
  authorize(['user:edit']),
  userController.updateUser.bind(userController)
);

router.delete(
  '/:userId',
  authMiddleware,
  authorize(['user:delete']),
  userController.deleteUser.bind(userController)
);

// User invitation resend route
router.post(
  '/:userId/resend-invite',
  authMiddleware,
  authorize(['user:create']),
  userController.resendInvitation.bind(userController)
);

// User preferences routes - only requires basic auth
// (permission checks are handled in the controller)
router.get(
  '/:userId/preferences',
  authMiddleware,
  userController.getUserPreferences.bind(userController)
);

router.patch(
  '/:userId/preferences',
  authMiddleware,
  userController.updateUserPreferences.bind(userController)
);

export { router as userRoutes }; 
import express from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../../auth/middleware/authMiddleware';
import { authorize } from '../../auth/middleware/authMiddleware';
import { PERMISSIONS } from '../../../config/permissions';
const router = express.Router();
const userController = new UserController();

// User management routes - require auth and proper permissions
router.get(
  '/',
  authMiddleware,
  authorize([PERMISSIONS.USER.VIEW]),
  userController.getAllUsers.bind(userController)
);

router.post(
  '/',
  authMiddleware,
  authorize([PERMISSIONS.USER.CREATE]),
  userController.inviteUser.bind(userController)
);

router.get(
  '/:userId',
  authMiddleware,
  authorize([PERMISSIONS.USER.VIEW]),
  userController.getUserById.bind(userController)
);

router.patch(
  '/:userId',
  authMiddleware,
  authorize([PERMISSIONS.USER.EDIT]),
  userController.updateUser.bind(userController)
);

router.delete(
  '/:userId',
  authMiddleware,
  authorize([PERMISSIONS.USER.DELETE]),
  userController.deleteUser.bind(userController)
);

// User invitation resend route
router.post(
  '/:userId/resend-invite',
  authMiddleware,
  authorize([PERMISSIONS.USER.CREATE]),
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
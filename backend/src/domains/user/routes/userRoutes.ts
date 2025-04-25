import express from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware, authorize, restrictToSameOrganization } from '../../auth/middleware/authMiddleware';
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
  restrictToSameOrganization('userId'),
  userController.getUserById.bind(userController)
);

router.patch(
  '/:userId',
  authMiddleware,
  authorize([PERMISSIONS.USER.EDIT]),
  restrictToSameOrganization('userId'),
  userController.updateUser.bind(userController)
);

router.delete(
  '/:userId',
  authMiddleware,
  authorize([PERMISSIONS.USER.DELETE]),
  restrictToSameOrganization('userId'),
  userController.deleteUser.bind(userController)
);

// User invitation resend route
router.post(
  '/:userId/resend-invite',
  authMiddleware,
  authorize([PERMISSIONS.USER.CREATE]),
  restrictToSameOrganization('userId'),
  userController.resendInvitation.bind(userController)
);

// User preferences routes - only requires basic auth
// (permission checks are handled in the controller)
router.get(
  '/:userId/preferences',
  authMiddleware,
  restrictToSameOrganization('userId'),
  userController.getUserPreferences.bind(userController)
);

router.patch(
  '/:userId/preferences',
  authMiddleware,
  restrictToSameOrganization('userId'),
  userController.updateUserPreferences.bind(userController)
);

export { router as userRoutes }; 
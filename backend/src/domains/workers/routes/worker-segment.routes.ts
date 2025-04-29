import { Router } from 'express';
import { 
  getWorkerSegments,
  reconcileWorkerSegments,
  bulkReconcileWorkerSegments,
  checkWorkerInSegment
} from '../controllers/workerSegmentController';
import { authMiddleware as authenticate } from '../../auth/middleware/authMiddleware';

const router = Router();

// Apply authentication middleware
router.use(authenticate);

// Worker segment routes
router.get('/:workerId/segments', getWorkerSegments);
router.post('/:workerId/segments/reconcile', reconcileWorkerSegments);
router.get('/:workerId/segments/:segmentId', checkWorkerInSegment);

// Bulk operations
router.post('/segments/bulk-reconcile', bulkReconcileWorkerSegments);

export default router; 
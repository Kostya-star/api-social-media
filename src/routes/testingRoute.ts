import { testingController } from '@/composition-root';
import { Router } from 'express';

export const testingRoute = Router();

testingRoute.delete('/', testingController.deleteAllData.bind(testingController));

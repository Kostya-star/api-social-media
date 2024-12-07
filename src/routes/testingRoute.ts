import { testingController } from '@/composition-api';
import { Router } from 'express';

export const testingRoute = Router();

testingRoute.delete('/', testingController.deleteAllData.bind(testingController));

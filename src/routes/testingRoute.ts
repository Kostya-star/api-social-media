import { Router } from 'express';
import testingController from '@/controllers/testing'

export const testingRoute = Router();

testingRoute.delete('/', testingController.deleteAllData);

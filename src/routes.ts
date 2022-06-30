import { Router } from 'express';

import { UserController } from './controllers/UsersController';
import { SurveysController } from './controllers/SurveysController';

const router = Router();

const usersController = new UserController();
const surveysController = new SurveysController();

router.post('/users', usersController.create);

router.get('/surveys', surveysController.index);
router.post('/surveys', surveysController.create);

export { router };

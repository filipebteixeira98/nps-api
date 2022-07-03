import { Router } from 'express';

import { UserController } from './controllers/UsersController';
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();

const usersController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();

router.post('/users', usersController.create);

router.get('/surveys', surveysController.index);
router.post('/surveys', surveysController.create);

router.post('/sendMail', sendMailController.execute);

export { router };

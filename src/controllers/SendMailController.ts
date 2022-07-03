import { resolve } from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

import SendMailService from '../services/SendMailService';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) {
      return response.status(400).json({ error: 'User does not exists!' });
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveyAlreadyExists) {
      return response.status(400).json({ error: 'Survey does not exists!' });
    }

    const templateFilePath = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'npsMail.hbs'
    );

    const context = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      user_id: userAlreadyExists.id,
      link: process.env.URL_MAIL,
    };

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: userAlreadyExists.id }, { value: null }],
      relations: ['user', 'survey'],
    });

    if (surveyAlreadyExists) {
      await SendMailService.execute(
        email,
        surveyAlreadyExists.title,
        context,
        templateFilePath
      );

      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(
      email,
      surveyAlreadyExists.title,
      context,
      templateFilePath
    );

    return response.json(surveyUser);
  }
}

export { SendMailController };

import Joi from 'joi';

export const idParam = Joi.object({
  id: Joi.string().uuid().required(),
});

export default { idParam };

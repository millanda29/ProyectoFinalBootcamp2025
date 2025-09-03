import { body, validationResult } from 'express-validator';

const validateRequest = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

export default validateRequest;

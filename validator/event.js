const eventValidationRules = [
    body('eventTitle').isLength({ min: 3 }).withMessage('Event title should be more then 3 characters long'),
    body('eventDescription').isLength({ min: 20 }).withMessage('Event info should be at least 20 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ];
  
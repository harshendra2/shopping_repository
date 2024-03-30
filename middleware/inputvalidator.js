const { body } = require('express-validator');

//user input validation
exports.emailvalidate = () => {
  return [
    body('email')
      .isEmail().withMessage('Invalid email address')
      .custom(value => {
        for (let i = 0; i < value.length; i++) {
          if (!isValidEmailCharacter(value[i])) {
            throw new Error('Invalid character in email');
          }
        }
        return true;
      }),

    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .custom(value => {
        for (let i = 0; i < value.length; i++) {
          if (!isValidPasswordCharacter(value[i])) {
            throw new Error('Invalid character in password');
          }
        }
        return true;
      })

     
  ];
};


function isValidEmailCharacter(char) {
  const validCharacters = /^[a-zA-Z0-9.@]+$/;
  return validCharacters.test(char);
}

function isValidPasswordCharacter(char) {
  const validCharacters = /^[a-zA-Z0-9!@#$%^&*()_+[\]{}|;':",./<>?`~\\-]+$/;
  return validCharacters.test(char);
}


//user register validataion
exports.registervalidate = () => {
    return [
        body('fname')
        .isLength({ min: 5 }).withMessage('Name must be at least 5 characters long')
        .matches(/^[a-zA-Z]+$/).withMessage('Name can only contain letters'),
    
        body('email')
        .isEmail().withMessage('Invalid email address')
        .custom(value => {
          for (let i = 0; i < value.length; i++) {
            if (!isValidEmailCharacter(value[i])) {
              throw new Error('Invalid character in email');
            }
          }
          return true;
        }),
    
        body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .custom(value => {
          for (let i = 0; i < value.length; i++) {
            if (!isValidPasswordCharacter(value[i])) {
              throw new Error('Invalid character in password');
            }
          }
          return true;
        }),
        body('mobile')
        .isNumeric().withMessage('Mobile number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits long')
      ];
}



exports.productvalidate = () => {
  return [
      body('title')
      .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long')
      .matches(/^[a-zA-Z]+$/).withMessage('Title can only contain letters'),
  
     
      body('description')
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long')
      .trim() 
      .notEmpty().withMessage('Description is required')
    

    ];
}

import jwt from 'jsonwebtoken';

export const generateVerificationToken = (internId) => {
   return jwt.sign({ internId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Password Reset Token
export const generateResetToken = (internId) => {
   if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
   }

   try {
      const resetToken = jwt.sign({ internId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return resetToken;
   } catch (error) {
      throw new Error('Could not generate reset token');
   }
};


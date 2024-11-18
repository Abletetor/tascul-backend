import jwt from 'jsonwebtoken';

// Middleware to protect routes
const protect = (req, res, next) => {
   // Extract token from the Authorization header
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      return res.status(401).json({ message: 'No token provided' });
   }

   try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
   } catch (error) {
      console.error('Error verifying token:', error);

      if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({ message: 'Invalid or malformed token' });
      }

      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ message: 'Token has expired' });
      }

      return res.status(401).json({ message: 'Failed to verify token' });
   }
};


export default protect;

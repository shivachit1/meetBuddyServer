import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import logger from '../logger.js';
const key = 'njn%_jdvnufnvuenuffqewd83f35i9gk35ijgn5tjim5imm5jigu5ngung56%'

export const generateToken = (payload) => {
  return jwt.sign(payload, key, { expiresIn: '1h' });
};

export const authenticateJWT = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // affer splitting with ' ', 
    jwt.verify(token, key, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      const loggedInUser = await User.findById(user.id)
      if (!loggedInUser) {
        logger.warn("Unable to find user")
        logger.error("Failed to create new event")
        res.status(404).send("Failed to verify token")
      }

      req.user = user; // Store user information in request object
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
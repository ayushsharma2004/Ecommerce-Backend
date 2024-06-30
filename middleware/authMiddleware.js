import JWT from 'jsonwebtoken';
import { db } from '../DB/firestore.js';

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the token from the request headers
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is required. Please login again.',
      });
    }

    const decode = JWT.verify(token, process.env.JWT_token);
    req.user_id = decode.id;
    console.log("inside signin", decode.id);
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  if (req.user_id) {
    try {
      const userRef = db.collection(process.env.userCollection).doc(req.user_id);
      const response = await userRef.get();
      const user = response.data();
      if (user.role <= 1) {
        return res.status(401).send({
          success: false,
          message: 'Unauthorized Access',
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        message: 'Error in Admin Access',
        error: error,
      });
    }
  }
  else {
    return res.status(400).send("Userid is not provided")
  }
};

export const isUser = async (req, res, next) => {
  if (req.user_id) {
    try {
      const user_doc = await db.collection(process.env.userCollection).doc(req.user_id).get()
      const { role } = user_doc.data()
      if (Number(role) == 0) {
        console.log("user signed in")
        next()
      }
      else {
        res.status(401).send("unauthorized")
      }
    }
   catch(err){
    console.log("error")
   } 
  }
}

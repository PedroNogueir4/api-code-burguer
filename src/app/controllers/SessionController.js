import * as Yup from "yup";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";
import User from "../models/User.js";

class SessionController {
  async store(request, response) {
    
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      const emailOrPasswordIncorrect = () => {
        return response
          .status(400)
          .json({ error: "Email or password is incorrect" });
      };

      if (!(await schema.isValid(request.body))) {
        emailOrPasswordIncorrect();
      }

      const { email, password } = request.body;

      const user = await User.findOne({
        where: { email },
      });

       if (!user) emailOrPasswordIncorrect();

      if (!(await user.checkPassword(password))) {
        return response
        .status(400)
        .json({ error: "Email or password is incorrect" })
      }

      return response.json({
        id: user.id,
        email: user.email,
        name: user.name,
        admin: user.admin,
        token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
      
   
    
  }
}
export default new SessionController();

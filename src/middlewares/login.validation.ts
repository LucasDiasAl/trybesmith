import { Response, Request, NextFunction } from 'express';

type Login = {
  username: string,
  password: string
};
const properties = ['username', 'password'];

export default class LoginMiddleware {
  static validateProperties = (login: Login): string | null => {
    for (let i = 0; i < properties.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(login, properties[i])) {
        return properties[i];
      }
    }
    return null;
  };
  
  static validateValues = (login: Login): string | null => {
    const entries = Object.entries(login);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value] = entries[i];
      if (!value) {
        return property;
      }
    }
    return null;
  };
  
  public loginValidation = (req: Request, res: Response, next: NextFunction) => {
    const login = req.body;
    const propertiesIsValid = LoginMiddleware.validateProperties(login);
    if (propertiesIsValid) {
      return res.status(400)
        .json({ message: `"${propertiesIsValid}" is required` });
    }
    const valuesIsValid = LoginMiddleware.validateValues(login);
    if (valuesIsValid) return res.status(400).json({ message: `"${valuesIsValid}" is required` });
    next();
  };
}

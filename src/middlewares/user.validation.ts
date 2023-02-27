import { Response, Request, NextFunction } from 'express';

type User = {
  username: string,
  vocation: string,
  level: number,
  password: string
};

type Size = {
  [index: string]: number,
};

const charctersSize: Size = {
  username: 3,
  vocation: 3,
  level: 1,
  password: 8,
};

const properties = ['username', 'vocation', 'level', 'password'];

export default class UserValidation {
  static validateProperties = (user: User): string | null => {
    for (let i = 0; i < properties.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(user, properties[i])) {
        return `"${properties[i]}" is required`;
      }
    }
    return null;
  };

  static validateType = (user: User): string | null => {
    const entries = Object.entries(user);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value]: [string, string | number] = entries[i];
      const type: string = property === 'level' ? 'number' : 'string';
      if (typeof value !== type) {
        return `"${property}" must be a ${type}`;
      }
    }
    return null;
  };

  static validateValuesString = (user: User): string | null => {
    const entries = Object.entries(user);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value]: [string, string | number] = entries[i];
      if (typeof value !== 'number' && value.length < charctersSize[property]) {
        return `"${property}" length must be at least ${charctersSize[property]} characters long`;
      }
    }
    return null;
  };

  static validateValuesNumber = (user: User): string | null => {
    const ValuesString = UserValidation.validateValuesString(user);
    if (ValuesString) return ValuesString;
    if (user.level <= 0) return '"level" must be greater than or equal to 1';
    return null;
  };

  public userValidation = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    const propertiesIsValid = UserValidation.validateProperties(user);
    if (propertiesIsValid) {
      return res.status(400)
        .json({ message: propertiesIsValid });
    }
    const typeIsValid = UserValidation.validateType(user);
    if (typeIsValid) {
      return res.status(422)
        .json({ message: typeIsValid });
    }
    const valuesIsValid = UserValidation.validateValuesNumber(user);
    if (valuesIsValid) {
      return res.status(422)
        .json({ message: valuesIsValid });
    }
    next();
  };
}
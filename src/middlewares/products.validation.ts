import { Response, Request, NextFunction } from 'express';

const properties = ['name', 'amount'];

type Product = {
  name: string,
  amount: string,
};

export default class ProductsMiddleware {
  static validateProperties = (product: Product): string | null => {
    for (let i = 0; i < properties.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(product, properties[i])) {
        return properties[i];
      }
    }
    return null;
  };

  static validateType = (product: Product): string | null => {
    const entries = Object.entries(product);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value] = entries[i];
      if (typeof value !== 'string') {
        return property;
      }
    }
    return null;
  };
  
  static validateValues = (product: Product): string | null => {
    const entries = Object.entries(product);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value] = entries[i];
      if (value.length < 3) {
        return property;
      }
    }
    return null;
  };

  public productValidation = (req: Request, res: Response, next: NextFunction) => {
    const product = req.body;
    const propertiesIsValid = ProductsMiddleware.validateProperties(product);
    if (propertiesIsValid) {
      return res.status(400)
        .json({ message: `"${propertiesIsValid}" is required` });
    }
    const typeIsValid = ProductsMiddleware.validateType(product);
    if (typeIsValid) {
      return res.status(422)
        .json({ message: `"${typeIsValid}" must be a string` });
    }
    const valuesIsValid = ProductsMiddleware.validateValues(product);
    if (valuesIsValid) {
      return res.status(422)
        .json({ message: `"${valuesIsValid}" length must be at least 3 characters long` });
    }
    next();
  };
}
import { Response, Request, NextFunction } from 'express';

const properties = 'productsIds';

type Product = {
  productsIds: number[],
};

export default class NewOrdersMiddleware {
  static validateProperties = (product: Product): string | null => {
    if (!Object.prototype.hasOwnProperty.call(product, properties)) {
      return properties;
    }

    return null;
  };

  static validateIsArray = (product: Product): string | null => {
    const { productsIds } = product;
    if (!Array.isArray(productsIds)) return properties;
    return null;
  };

  static validateType = (product: Product): string | null => {
    const ids = product.productsIds;
    if (ids.length <= 0) return properties;
    for (let i = 0; i < ids.length; i += 1) {
      if (typeof ids[i] !== 'number') {
        return properties;
      }
    }
    return null;
  };

  public productValidation = (req: Request, res: Response, next: NextFunction) => {
    const product: Product = req.body;
    const propertiesIsValid = NewOrdersMiddleware.validateProperties(product);
    if (propertiesIsValid) {
      return res.status(400)
        .json({ message: '"productsIds" is required' });
    }
    const isArray = NewOrdersMiddleware.validateIsArray(product);
    if (isArray) {
      return res.status(422)
        .json({ message: '"productsIds" must be an array' });
    }
    const typeIsValid = NewOrdersMiddleware.validateType(product);
    if (typeIsValid) {
      return res.status(422)
        .json({ message: '"productsIds" must include only numbers' });
    }
    next();
  };
}
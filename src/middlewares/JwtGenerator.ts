import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';

dotenv.config();

const jwtConfig: SignOptions = {
  algorithm: 'HS256',
};

type Data = {
  id?: number,
  username: string,
};

export default (data: Data) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET as string, jwtConfig);
  return token;
};
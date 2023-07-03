import * as jwt from 'jsonwebtoken';

const decode = (token: string): jwt.JwtPayload =>
  jwt.decode(token, { json: true });

export default { decode };

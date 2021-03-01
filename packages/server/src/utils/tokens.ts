import { sign, verify } from 'jsonwebtoken';

export const encodeJWT = (payload: tokenType): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '364d' },
      (err, token) => {
        if (err) return reject(err);
        else return resolve(token);
      }
    );
  });
};

export const decodeJWT = (token: string): Promise<undefined | object> => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      if (err) return reject(err);
      else return resolve(payload);
    });
  });
};

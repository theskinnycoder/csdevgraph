declare namespace Express {
  interface Request {
    user?: import('../src/models/User').default | undefined;
  }
}

type tokenType = (string | object | Buffer) & { id: string };

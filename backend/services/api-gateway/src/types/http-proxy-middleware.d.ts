declare module 'http-proxy-middleware' {
  import { Request, Response, NextFunction } from 'express';

  interface Options {
    target?: string;
    changeOrigin?: boolean;
    onError?: (err: Error, req: Request, res: Response) => void;
    onProxyReq?: (proxyReq: any, req: Request, res: Response) => void;
  }

  function createProxyMiddleware(options: Options): (req: Request, res: Response, next: NextFunction) => void;
  
  export { createProxyMiddleware };
}


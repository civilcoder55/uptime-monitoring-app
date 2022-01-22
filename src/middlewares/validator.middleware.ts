import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";

export default (schema: AnySchema) =>
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: any) {
      return res.status(400).json({ message: error.errors[0] });
    }
  };

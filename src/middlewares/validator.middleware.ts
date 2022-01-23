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

      // remove unknown fields and reassign to request body object
      req.body = schema.cast({ body: req.body }, { stripUnknown: true })?.body;

      return next();
    } catch (error: any) {
      return res.status(400).json({ message: error.errors[0] });
    }
  };

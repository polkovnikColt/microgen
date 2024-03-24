import { Router, Request, Response } from "express";
import { getHello } from "./app.service";

export const getHelloRoute = Router();

getHelloRoute.get("/", (req: Request, res: Response) => {
  res.send(getHello());
});

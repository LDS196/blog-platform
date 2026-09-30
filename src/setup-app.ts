import express, { Express, Request, Response } from "express";
import { HttpStatus } from "./core/types/http-statuses";
import { BLOGS_PATH } from "./blogs/constants/blogs.paths";
import { blogsRouter } from "./blogs/routers/blogs.router";

export const setupApp=(app:Express)=>{

  app.use(express.json())
  // Health-check: простой ответ, что сервер жив.
  app.get("/",(reg:Request, res:Response)=>{
    res.status(HttpStatus.Ok).send("Hello world!")
  })

  app.use(BLOGS_PATH, blogsRouter)

}

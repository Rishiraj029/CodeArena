import express from "express";
import { ENV } from "./lib/env.js";

const app = express();



app.get("/health", (req, res) => {
  res.status(200).json({msg:"api is up and running"})
})

app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));

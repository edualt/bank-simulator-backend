const express = require('express');
const morgan = require('morgan');

//Routes
import UserRoutes from "./routes/users.routes";

const app = express();

//port
app.set("port", 4000);

//middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api/users", UserRoutes )

export default app;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Routes
import UserRoutes from "./routes/users.routes";

const app = express();

//port
app.set("port", 4000);

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users", UserRoutes )

export default app;
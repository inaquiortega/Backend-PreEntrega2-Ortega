import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter(io));
app.use("/api/carts", cartRouter);

io.on("connection", (socket) => {
  console.log("Un usuario se conectó");

  socket.emit("updateProducts", products);

  socket.on("disconnect", () => {
    console.log("Un usuario se desconectó");
  });
});

httpServer.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});

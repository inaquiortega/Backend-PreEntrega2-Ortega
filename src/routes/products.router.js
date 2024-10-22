import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

export default (io) => {
  router.get("/", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const products = await productManager.getAllProducts(limit);
      res.json(products);
    } catch (error) {
      console.log(error);
    }
  });

  router.get("/:pid", async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productManager.getProductById(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title, description, code, price, stock, category } = req.body;

      if (!title || !description || !code || !price || !stock || !category) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }

      const newProduct = await productManager.addProduct({
        title,
        description,
        code,
        price,
        stock,
        category,
      });

      io.emit("updateProducts", await productManager.getAllProducts());

      res.json(newProduct);
    } catch (error) {
      console.log(error);
    }
  });

  router.put("/:pid", async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const updatedProduct = await productManager.updateProduct(
        productId,
        req.body
      );

      if (updatedProduct) {
        io.emit("updateProducts", await productManager.getAllProducts());
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.delete("/:pid", async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const deletedProduct = await productManager.deleteProduct(productId);

      if (deletedProduct) {
        io.emit("updateProducts", await productManager.getAllProducts());
        res.json(deletedProduct);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      console.log(error);
    }
  });

  return router;
};

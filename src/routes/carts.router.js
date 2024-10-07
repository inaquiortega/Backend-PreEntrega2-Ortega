import { Router } from "express";
import CartManager from "../services/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const carts = await cartManager.getAllCarts(limit);
    res.json(carts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching carts" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching cart" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = await cartManager.addProductToCart(cartId, productId);

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error agregando producto a carrito" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = await cartManager.removeProductFromCart(
      cartId,
      productId
    );

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error agregando producto a carrito" });
  }
});

export default router;

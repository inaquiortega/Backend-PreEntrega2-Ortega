import fs from "fs/promises";
import path from "path";

const cartsFilePath = path.resolve("data", "carrito.json");

export default class CartManager {
  constructor() {
    this.carts = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(cartsFilePath, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveToFile() {
    try {
      await fs.writeFile(cartsFilePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error("Error saving carts to file:", error);
    }
  }

  getAllCarts(limit) {
    if (limit) {
      return this.carts.slice(0, limit);
    }
    return this.carts;
  }

  getCartById(userId) {
    return this.carts.find((cart) => cart.userId === userId);
  }

  async createCart() {
    const newCart = {
      userId: this.carts.length
        ? this.carts[this.carts.length - 1].userId + 1
        : 1,
      products: [],
    };
    this.carts.push(newCart);
    await this.saveToFile();
    return newCart;
  }

  async addProductToCart(userId, productId) {
    const cart = this.getCartById(userId);
    if (!cart) return null;

    const productInCart = cart.products.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 });
    }

    await this.saveToFile();
    return cart;
  }

  async removeProductFromCart(userId, productId) {
    const cart = this.getCartById(userId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex === -1) return null;

    cart.products.splice(productIndex, 1);

    await this.saveToFile();
    return cart;
  }

  async deleteCart(userId) {
    const cartIndex = this.carts.findIndex((cart) => cart.userId === userId);
    if (cartIndex === -1) return null;

    const deletedCart = this.carts.splice(cartIndex, 1);

    await this.saveToFile();
    return deletedCart[0];
  }
}

const Cart = require("../models/Cart");

// Helper function to sanitize cart data
const sanitizeCart = (cart) => {
  if (!cart) return { items: [], totalCost: 0 };

  return {
    items: cart.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      version: item.version,
      offerPrice: item.offerPrice,
      quantity: item.quantity,
    })),
    totalCost: cart.totalCost,
  };
};

// Add to Cart
const addToCart = async (req, res) => {
  const { userId, productId, title, image, version, offerPrice } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalCost: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.version === version
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, title, image, version, offerPrice, quantity: 1 });
    }

    cart.totalCost = cart.items.reduce((total, item) => total + item.offerPrice * item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart: sanitizeCart(cart) });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  const { userId, productId, version } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId || item.version !== version
    );

    cart.totalCost = cart.items.reduce((total, item) => total + item.offerPrice * item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart: sanitizeCart(cart) });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from cart", error });
  }
};

// Update Quantity
const updateQuantity = async (req, res) => {
  const { userId, productId, version, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId && item.version === version
    );

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.productId.toString() !== productId || i.version !== version
        );
      }
    }

    cart.totalCost = cart.items.reduce((total, item) => total + item.offerPrice * item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: "Quantity updated", cart: sanitizeCart(cart) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error });
  }
};

// Get Cart
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ items: [], totalCost: 0 });
    }

    res.status(200).json(sanitizeCart(cart));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};

module.exports = { addToCart, removeFromCart, updateQuantity, getCart };
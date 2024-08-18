import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<CartDocument>) { }

  // Create a new cart
  async createCart(userId: string, itemDTO: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<Cart> {
    const newCart = await this.cartModel.create({
      // specific user, item's list and prices
      userId,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice
    });
    return newCart;
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ userId });
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const deletedCart = await this.cartModel.findOneAndDelete({ userId });
    return deletedCart;
  }

  // Recalculates cart total
  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    // quantity and price of each item
    cart.items.forEach(item => {
      cart.totalPrice += (item.quantity * item.price);
    })
  }

   
  async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quantity, price } = itemDTO;
    const subTotalPrice = quantity * price;

    const cart = await this.getCart(userId);

    // if the cart exists
    if (cart) {
      // search for item in cart by his productId
      const itemIndex = cart.items.findIndex((item) => item.productId == productId);

      // If the item already exists in the cart
      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        // The item quantity is incremented and the subtotal is recalculated
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
        // The cart is recalculated
        this.recalculateCart(cart);
        // save user's cart to the database
        return cart.save();
        
        // If the item does not exist in the cart
      } else {
        cart.items.push({ ...itemDTO, subTotalPrice });
        this.recalculateCart(cart);
        return cart.save();
      }

      // If the cart does not exist
    } else {
      const newCart = await this.createCart(userId, itemDTO, subTotalPrice, price);
      return newCart;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex((item) => item.productId == productId);

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      return cart.save();
    }
  }
}
import {Item} from './Item'

export class CartItem {
  constructor(item: Item, quantity: number) {
    this.barcode = item.barcode
    this.name = item.name
    this.unit = item.unit
    this.price = item.price
    this.quantity = quantity
    this.subtotal = item.price * quantity
  }

  addQuantity(quantity: number) {
    this.quantity += quantity
    this.subtotal += this.price * quantity
  }

  toString() {
    return `Name：${this.name}，Quantity：${this.quantity} ${this.unit}s，Unit：${this.price.toFixed(2)}(yuan)，Subtotal：${this.subtotal.toFixed(2)}(yuan)`
  }

  barcode = ''
  name = ''
  unit = ''
  price = 0
  quantity = 0
  subtotal = 0
  discount = 0
}

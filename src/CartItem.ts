import {Item} from './Item'

export class CartItem {
  constructor(item: Item) {
    this.barcode = item.barcode
    this.name = item.name
    this.unit = item.unit
    this.price = item.price
    this.quantity = 1
    this.subtotal = item.price
  }

  addQuantity(quantity: number) {
    this.quantity += quantity
    this.subtotal += this.price * quantity
  }

  barcode = ''
  name = ''
  unit = ''
  price = 0
  quantity = 0
  subtotal = 0
  discount = 0
}

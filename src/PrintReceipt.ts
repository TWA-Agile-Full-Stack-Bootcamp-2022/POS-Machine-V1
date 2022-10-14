import {loadAllItems, loadPromotions} from './Dependencies'
import {CartItem} from './CartItem'
import {Item} from './Item'
import {Promotion} from './Promotion'

export function printReceipt(tags: string[]): string {
  const cartItems = getCartItems(tags)
  const [totalPrice, discount] = calculateTotalPrice(cartItems)
  return printReceiptText(cartItems, [totalPrice, discount])
}

function printReceiptText(cartItems: CartItem[], [totalPrice, discount]: [number, number]) {
  const itemReceipt = cartItems.map(cartItem => printReceiptForCartItem(cartItem))
  return `***<store earning no money>Receipt ***
${itemReceipt.join('\n')}
----------------------
${printTotalPriceAndDiscount(totalPrice, discount)}
**********************`
}

function printReceiptForCartItem(cartItem: CartItem) {
  return `Name：${cartItem.name}，Quantity：${cartItem.quantity} ${cartItem.unit}s，Unit：${cartItem.price.toFixed(2)}(yuan)，Subtotal：${cartItem.subtotal.toFixed(2)}(yuan)`
}

function printTotalPriceAndDiscount(totalPrice: number, discount: number) {
  return `Total：${totalPrice.toFixed(2)}(yuan)\nDiscounted prices：${discount.toFixed(2)}(yuan)`
}

export function getCartItems(tags: string[]): CartItem[] {
  const items: Item[] = loadAllItems()
  const promotions: Promotion[] = loadPromotions()

  const cartItems = calculateCartItems(tags, items)

  calculateWithPromotions(cartItems, promotions)

  return cartItems
}

export function calculateTotalPrice(cartItems: CartItem[]) {
  const totalPrice = cartItems.map(cartItem => cartItem.subtotal).reduce((accumulator, subtotal) => accumulator + subtotal)
  const discountedPrice = cartItems.map(cartItem => cartItem.discount).reduce((accumulator, discount) => accumulator + discount)
  return [totalPrice, discountedPrice]
}

function calculateCartItems(tags: string[], items: Item[]) {
  const cartItems: CartItem[] = []
  tags.forEach(tag => {
    const [barcode, quantity] = getBarcodeAndQuantity(tag)
    const matchedCartItem = cartItems.find(cartItem => cartItem.barcode === barcode)
    if (matchedCartItem) {
      matchedCartItem.addQuantity(quantity)
    } else {
      const matchedItem = items.find(item => item.barcode === barcode)
      if (matchedItem) {
        cartItems.push(new CartItem(matchedItem, quantity))
      }
    }
  })
  return cartItems
}

function getBarcodeAndQuantity(tag: string): [string, number] {
  if (tag.includes('-')) {
    const barcodeAndQuantity = tag.split('-')
    return [barcodeAndQuantity[0], Number(barcodeAndQuantity[1])]
  }
  return [tag, 1]
}

function calculateWithPromotions(cartItems: CartItem[], promotions: Promotion[]) {
  cartItems.forEach(cartItem => {
    const promotion = promotions.find(promotion => promotion.barcodes.includes(cartItem.barcode))
    if (promotion) {
      calculatePromotion(cartItem, promotion)
    }
  })
}

function calculatePromotion(cartItem: CartItem, promotion: Promotion) {
  if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
    cartItem.discount = Math.floor(cartItem.quantity / 3) * cartItem.price
    cartItem.subtotal -= cartItem.discount
  }
}

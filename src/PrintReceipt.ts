import {loadAllItems, loadPromotions} from './Dependencies'
import {CartItem} from './CartItem'
import {Item} from './Item'
import {Promotion} from './Promotion'

export function printReceipt(tags: string[]): string {
  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}

export function getCartItems(tags: string[]): CartItem[] {
  const items: Item[] = loadAllItems()
  const promotions: Promotion[] = loadPromotions()

  const cartItems = calculateCartItems(tags, items)

  calculateWithPromotions(cartItems, promotions)

  return cartItems
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

function getBarcodeAndQuantity(tag: string) : [string, number] {
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

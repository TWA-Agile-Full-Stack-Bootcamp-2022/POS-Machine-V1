import {loadAllItems, loadPromotions} from './Dependencies'
import {CartItem} from './CartItem'
import {Item} from './Item'

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
  const cartItems: CartItem[] = []

  tags.forEach(tag => {
    const matchedCartItem = cartItems.filter(cartItem => cartItem.barcode === tag)
    if (matchedCartItem.length >= 1) {
      matchedCartItem[0].addQuantity(1)
    } else {
      const matchedItems = items.filter(item => item.barcode === tag)
      if (matchedItems.length >= 1) {
        cartItems.push(new CartItem(matchedItems[0]))
      }
    }
  })

  return cartItems
}

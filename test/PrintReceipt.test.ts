import {printReceipt, getCartItems} from '../src/PrintReceipt'
import {CartItem} from '../src/CartItem'

describe('printReceipt', () => {
  it('should print receipt with promotion when print receipt', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ]

    const expectText = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`

    expect(printReceipt(tags)).toEqual(expectText)
  })

  it('should calculate subtotal price without promotion when get cart items', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000005'
    ]

    const cartItems: CartItem[] = getCartItems(tags)

    expect(cartItems).toHaveLength(2)
    expect(cartItems[0].name).toBe('Sprite')
    expect(cartItems[0].barcode).toBe('ITEM000001')
    expect(cartItems[0].unit).toBe('bottle')
    expect(cartItems[0].quantity).toBe(2)
    expect(cartItems[0].subtotal).toBe(6.0)
    expect(cartItems[0].discount).toBe(0)
    expect(cartItems[1].name).toBe('Instant Noodles')
    expect(cartItems[1].barcode).toBe('ITEM000005')
    expect(cartItems[1].unit).toBe('bag')
    expect(cartItems[1].quantity).toBe(1)
    expect(cartItems[1].subtotal).toBe(4.5)
    expect(cartItems[1].discount).toBe(0)
  })

  it('should calculate subtotal price and discount with promotion when get cart items', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001'
    ]

    const cartItems: CartItem[] = getCartItems(tags)

    expect(cartItems).toHaveLength(1)
    expect(cartItems[0].name).toBe('Sprite')
    expect(cartItems[0].barcode).toBe('ITEM000001')
    expect(cartItems[0].unit).toBe('bottle')
    expect(cartItems[0].quantity).toBe(3)
    expect(cartItems[0].subtotal).toBe(6.0)
    expect(cartItems[0].discount).toBe(3.0)
  })

  it('should calculate subtotal price and discount with promotion when get cart items given tags with dash', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001-2'
    ]

    const cartItems: CartItem[] = getCartItems(tags)

    expect(cartItems).toHaveLength(1)
    expect(cartItems[0].name).toBe('Sprite')
    expect(cartItems[0].barcode).toBe('ITEM000001')
    expect(cartItems[0].unit).toBe('bottle')
    expect(cartItems[0].quantity).toBe(3)
    expect(cartItems[0].subtotal).toBe(6.0)
    expect(cartItems[0].discount).toBe(3.0)
  })
})

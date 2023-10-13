import {calculateBuyTwoGetOneFreePromotion, calculateQuantity, calculateTotalPrice, checkTags, printReceipt} from '../src/PrintReceipt'

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

  it('should get each tag quantity when given tags', () => {
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

    expect(calculateQuantity(tags)).toEqual([
      {barcode: 'ITEM000001', quantity: 5},
      {barcode: 'ITEM000003', quantity: 2.5},
      {barcode: 'ITEM000005', quantity: 3}
    ])
  })

  it('should get valid tag item when given tags and all items info', () => {
    const tags = [
      {barcode: 'ITEM000001', quantity: 5},
      {barcode: 'ITEM000002', quantity: 3},
      {barcode: 'NOTINITEM', quantity: 2}
    ]

    const allItems = [
      {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      },
      {
        barcode: 'ITEM000002',
        name: 'Apple',
        unit: 'pound',
        price: 5.50
      }
    ]

    expect(checkTags(tags, allItems)).toEqual([
      {
        barcode: 'ITEM000001',
        quantity: 5,
        itemInfo: {
          barcode: 'ITEM000001',
          name: 'Sprite',
          unit: 'bottle',
          price: 3.00
        }
      },
      {
        barcode: 'ITEM000002',
        quantity: 3,
        itemInfo: {
          barcode: 'ITEM000002',
          name: 'Apple',
          unit: 'pound',
          price: 5.50
        }
      }
    ])
  })

  it('should get total price call calculateTotalPrice when given tags', () => {
    const tags = [
      {
        barcode: 'ITEM000001',
        quantity: 5,
        itemInfo: {
          barcode: 'ITEM000001',
          name: 'Sprite',
          unit: 'bottle',
          price: 3.00
        }
      },
      {
        barcode: 'ITEM000002',
        quantity: 3,
        itemInfo: {
          barcode: 'ITEM000002',
          name: 'Apple',
          unit: 'pound',
          price: 5.50
        }
      }
    ]

    const result = calculateTotalPrice(tags)
    expect(result).toEqual([
      {
        barcode: 'ITEM000001',
        quantity: 5,
        totalPrice: 15,
        itemInfo: {
          barcode: 'ITEM000001',
          name: 'Sprite',
          unit: 'bottle',
          price: 3.00
        }
      },
      {
        barcode: 'ITEM000002',
        quantity: 3,
        totalPrice: 16.5,
        itemInfo: {
          barcode: 'ITEM000002',
          name: 'Apple',
          unit: 'pound',
          price: 5.50
        }
      }
    ])
  })

  it('should calculate buy two get one free promotion when given tag quantity is 2',  () => {
    const tag = {
      barcode: 'ITEM000001',
      quantity: 2,
      totalPrice: 6,
      itemInfo: {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      }
    }

    const result = calculateBuyTwoGetOneFreePromotion(tag)
    expect(result).toEqual({
      barcode: 'ITEM000001',
      quantity: 2,
      totalPrice: 6,
      discount: 0,
      itemInfo: {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      }
    })
  })

  it('should calculate buy two get one free promotion when given tag quantity is 3',  () => {
    const tag = {
      barcode: 'ITEM000001',
      quantity: 3,
      totalPrice: 9,
      itemInfo: {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      }
    }

    const result = calculateBuyTwoGetOneFreePromotion(tag)
    expect(result).toEqual({
      barcode: 'ITEM000001',
      quantity: 3,
      totalPrice: 9,
      discount: 3,
      itemInfo: {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      }
    })
  })

  it('should calculate buy two get one free promotion when given tag quantity is 6',  () => {
    const tag = {
      barcode: 'ITEM000001',
      quantity: 6,
      totalPrice: 18,
      itemInfo: {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      }
    }

    const result = calculateBuyTwoGetOneFreePromotion(tag)
    expect(result).toEqual({
      barcode: 'ITEM000001',
      quantity: 6,
      totalPrice: 18,
      discount: 6,
      itemInfo: {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      }
    })
  })



})

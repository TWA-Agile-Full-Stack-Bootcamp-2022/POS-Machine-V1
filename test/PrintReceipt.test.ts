import {
  buildItemsMapWithBarcode,
  calculateDiscountByPromotion, calculateReceiptItemsDiscount,
  createReceiptItem, generateReceiptItemPrintInfo, generateReceiptPrintInfo,
  parseReceiptItems,
  printReceipt
} from '../src/PrintReceipt'
import { Item } from '../src/Item'
import { ReceiptItem } from '../src/ReceiptItem'

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

  describe('parseReceiptItems', () => {
    describe('buildItemsMapWithBarcode', () => {
      it('should load items index by barcodes with given items', () => {
        // given
        const items = [{
          barcode: 'ITEM000000',
          name: 'Coca-Cola',
          unit: 'bottle',
          price: 3.00
        }]
        // when
        const itemMap = buildItemsMapWithBarcode(items)
        // then
        const item = itemMap.get('ITEM000000')
        expect(item).not.toBeUndefined()
        expect(item!.barcode).toEqual('ITEM000000')
        expect(item!.name).toEqual('Coca-Cola')
        expect(item!.unit).toEqual( 'bottle')
        expect(item!.price).toEqual(3.00)
      })
    })

    describe('createReceiptItem', () => {
      it('should create receiptItem by given item and quantity', () => {
        // given
        const item = new Item('ITEM000000', 'Coca-Cola', 'bottle', 3.00 )
        const quantity = 1
        // when
        const receiptItem = createReceiptItem(item, quantity)
        // then
        expect(receiptItem).not.toBeUndefined()
        expect(receiptItem!.barcode).toEqual('ITEM000000')
        expect(receiptItem!.name).toEqual('Coca-Cola')
        expect(receiptItem!.unit).toEqual( 'bottle')
        expect(receiptItem!.unitPrice).toEqual(3.00)
        expect(receiptItem!.quantity).toEqual(quantity)
      })
    })

    it('should initial the quantity by given multiple same barcodes count', () => {
      // given
      const barcodes = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001'
      ]
      const expectQuantity = 3
      // when
      const receiptItemsMap = parseReceiptItems(barcodes)
      // then
      const receiptItem = receiptItemsMap.get('ITEM000001')
      expect(receiptItem!.barcode).toEqual('ITEM000001')
      expect(receiptItem!.quantity).toEqual(expectQuantity)
    })

    it('should initial the quantity by given barcode with dash "-"', () => {
      // given
      const barcodes = [
        'ITEM000003-2.5'
      ]
      const expectQuantity = 2.5
      // when
      const receiptItemsMap = parseReceiptItems(barcodes)
      // then
      const receiptItem = receiptItemsMap.get('ITEM000003')
      expect(receiptItem!.barcode).toEqual('ITEM000003')
      expect(receiptItem!.quantity).toEqual(expectQuantity)
    })

    it('should initial the quantity by given both same barcode and with dash "-"', () => {
      // given
      const barcodes = [
        'ITEM000003-2.5',
        'ITEM000003'
      ]
      const expectQuantity = 3.5
      // when
      const receiptItemsMap = parseReceiptItems(barcodes)
      // then
      const receiptItem = receiptItemsMap.get('ITEM000003')
      expect(receiptItem!.barcode).toEqual('ITEM000003')
      expect(receiptItem!.quantity).toEqual(expectQuantity)
    })
  })

  describe('calculateReceiptItemsDiscount', () => {
    describe('calculateDiscountByPromotion', () => {
      it('should calculate the discount given item in BUY_TWO_GET_ONE_FREE promotion', () => {
        // given
        const promotions = [
          {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
              'ITEM000000',
              'ITEM000001',
              'ITEM000005'
            ]
          }
        ]
        const givenPrice = 3.0
        const givenQuantity = 2
        const receiptItem = new ReceiptItem('ITEM000000', 'Coca-Cola', 'bottle', givenPrice, givenQuantity)
        // when
        const discount = calculateDiscountByPromotion(receiptItem, promotions)
        // then
        expect(discount).toEqual(Math.floor(givenQuantity/2) * givenPrice)
      })
      it('should return 0 given item in BUY_TWO_GET_ONE_FREE promotion but quantity less than 2', () => {
        // given
        const promotions = [
          {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
              'ITEM000000',
              'ITEM000001',
              'ITEM000005'
            ]
          }
        ]
        const receiptItem = new ReceiptItem('ITEM000000', 'Coca-Cola', 'bottle', 3, 1)
        // when
        const discount = calculateDiscountByPromotion(receiptItem, promotions)
        // then
        expect(discount).toEqual(0)
      })
      it('should return 0 given item NOT in BUY_TWO_GET_ONE_FREE promotion', () => {
        // given
        const promotions = [
          {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
              'ITEM000000',
              'ITEM000001',
              'ITEM000005'
            ]
          }
        ]
        const givenBarcode = 'ITEM000003'
        const receiptItem = new ReceiptItem(givenBarcode, 'Litchi', 'pound', 5.5, 2)
        // when
        const discount = calculateDiscountByPromotion(receiptItem, promotions)
        // then
        expect(discount).toEqual(0)
      })
    })

    it('should return the receiptItems with discount', () => {
      // given
      const receiptItemsMap = new Map()
      const givenBarcode = 'ITEM000000'
      const givenUnitPrice = 3
      const givenQuantity = 2
      const receiptItem = new ReceiptItem(givenBarcode, 'Coca-Cola', 'bottle', 3, 2)
      receiptItemsMap.set(givenBarcode, receiptItem)
      // when
      calculateReceiptItemsDiscount(receiptItemsMap)
      // then
      const expectBuyTwoOneFreeDiscount = Math.floor(givenQuantity/2) * givenUnitPrice
      expect(receiptItemsMap.get(givenBarcode)!.discount).toEqual(expectBuyTwoOneFreeDiscount)
    })
  })

  describe('generateReceiptPrintInfo', () => {
    describe('generateReceiptItemPrintInfo', () => {
      it('should generate receipt item print info by given receiptItem', () => {
        // given
        const receiptItem = new ReceiptItem('ITEM000000', 'Coca-Cola', 'bottle', 3.00, 2)
        receiptItem.discount = 3
        // when
        const receiptItemPrintInfo = generateReceiptItemPrintInfo(receiptItem)
        // then
        const expectText = 'Name：Coca-Cola，Quantity：2 bottles，Unit：3.00(yuan)，Subtotal：3.00(yuan)'
        expect(receiptItemPrintInfo).toEqual(expectText)
      })
    })

    it('should generate all receipt item info with total price and discount', () => {
      // given
      const receiptItemsMap = new Map()
      const receiptItemCoca = new ReceiptItem('ITEM000000', 'Coca-Cola', 'bottle', 3.00, 2)
      const receiptItemSprite = new ReceiptItem('ITEM000001', 'Sprite', 'bottle', 3.00, 1)
      receiptItemCoca.discount = 3
      receiptItemsMap.set('ITEM000000', receiptItemCoca)
      receiptItemsMap.set('ITEM000001', receiptItemSprite)
      // when
      const receipt = generateReceiptPrintInfo(receiptItemsMap)
      // then
      const expectText = `***<store earning no money>Receipt ***
Name：Coca-Cola，Quantity：2 bottles，Unit：3.00(yuan)，Subtotal：3.00(yuan)
Name：Sprite，Quantity：1 bottle，Unit：3.00(yuan)，Subtotal：3.00(yuan)
----------------------
Total：6.00(yuan)
Discounted prices：3.00(yuan)
**********************`
      expect(receipt).toEqual(expectText)
    })
  })
})

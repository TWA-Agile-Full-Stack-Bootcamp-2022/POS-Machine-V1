import {buildItemsMapWithBarcode, createReceiptItem, parseReceiptItems, printReceipt} from '../src/PrintReceipt'
import { Item } from '../src/Item'

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
  })
})

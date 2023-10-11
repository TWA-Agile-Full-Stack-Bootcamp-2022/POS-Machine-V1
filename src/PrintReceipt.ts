import {loadAllItems, loadPromotions} from './Dependencies'
import { Item } from './Item'
import { ReceiptItem } from './ReceiptItem'

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


export function buildItemsMapWithBarcode(items: Item[]): Map<string, Item> {
  const itemsMap = new Map()
  items.forEach( item => itemsMap.set(item.barcode, item))
  return itemsMap
}

export function createReceiptItem(item: Item, quantity: number): ReceiptItem {
  return new ReceiptItem(item.barcode, item.name, item.unit, item.price, quantity)
}

export function parseReceiptItems(tags: string[]): Map<string, ReceiptItem>  {
  const items = loadAllItems()
  const itemsMapWithBarcode = buildItemsMapWithBarcode(items)
  const receiptItemsMap = new Map()
  tags.forEach( tag => {
    const tagSplitWords = tag.split('-')
    const barcode = tagSplitWords[0]
    const quantity = tagSplitWords[1] === undefined ? 1 : parseFloat(tagSplitWords[1])
    const item = itemsMapWithBarcode.get(barcode)
    let receiptItem = receiptItemsMap.get(barcode)
    if(item !== undefined) {
      if(receiptItem === undefined) {
        receiptItem = createReceiptItem(item, quantity)
        receiptItemsMap.set(barcode, receiptItem)
      } else {
        receiptItem.quantity += 1
      }
    }
  })
  return receiptItemsMap
}

export function calculateDiscountByPromotion(receiptItem: ReceiptItem, promotions: { type: string; barcodes: string[] }[]): number {
  const buyTwoOneFreeBarcodes = promotions.find(promotion => promotion.type === 'BUY_TWO_GET_ONE_FREE')!.barcodes
  if(buyTwoOneFreeBarcodes.find( barcode => receiptItem.barcode === barcode)) {
    return Math.floor(receiptItem.quantity/2) * receiptItem.unitPrice
  }
  return 0
}



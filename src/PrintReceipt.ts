import {loadAllItems, loadPromotions} from './Dependencies'
import { Item } from './Item'
import { ReceiptItem } from './ReceiptItem'

export function printReceipt(tags: string[]): string {
  const receiptItems = parseReceiptItems(tags)
  calculateReceiptItemsDiscount(receiptItems)
  return generateReceiptPrintInfo(receiptItems)
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
        receiptItem.quantity += quantity
      }
    }
  })
  return receiptItemsMap
}

export function calculateDiscountByPromotion(receiptItem: ReceiptItem, promotions: { type: string; barcodes: string[] }[]): number {
  const buyTwoOneFreeBarcodes = promotions.find(promotion => promotion.type === 'BUY_TWO_GET_ONE_FREE')!.barcodes
  if(buyTwoOneFreeBarcodes.find( barcode => receiptItem.barcode === barcode)) {
    return Math.floor(receiptItem.quantity/3) * receiptItem.unitPrice
  }
  return 0
}

export function calculateReceiptItemsDiscount(receiptItemsMap: Map<string, ReceiptItem>) {
  const promotions = loadPromotions()
  receiptItemsMap.forEach( (receiptItem) => {
    receiptItem.discount = calculateDiscountByPromotion(receiptItem, promotions)
  })
}

export function generateReceiptItemPrintInfo(receiptItem: ReceiptItem): string {
  const unitDescription = receiptItem.quantity > 1 ? receiptItem.unit + 's' : receiptItem.unit
  const subtotal = receiptItem.quantity * receiptItem.unitPrice - receiptItem.discount
  return `Name：${receiptItem.name}，` +
         `Quantity：${receiptItem.quantity} ${unitDescription}，` +
         `Unit：${receiptItem.unitPrice.toFixed(2)}(yuan)，` +
         `Subtotal：${subtotal.toFixed(2)}(yuan)`
}


export function generateReceiptPrintInfo(receiptItemsMap: Map<string, ReceiptItem>): string {
  const receiptHeader = '***<store earning no money>Receipt ***\n'
  let totalPrice = 0
  let discountedPrice = 0
  let receiptContents = ''
  receiptItemsMap.forEach( (receiptItem) => {
    receiptContents += (generateReceiptItemPrintInfo(receiptItem) + '\n')
    totalPrice += (receiptItem.unitPrice * receiptItem.quantity - receiptItem.discount)
    discountedPrice += receiptItem.discount
  })
  const receiptTotal = `----------------------
Total：${totalPrice.toFixed(2)}(yuan)
Discounted prices：${discountedPrice.toFixed(2)}(yuan)
**********************`
  return `${receiptHeader}${receiptContents}${receiptTotal}`
}




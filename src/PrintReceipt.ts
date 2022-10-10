import {loadAllItems, loadPromotions} from './Dependencies'

function loadProductMap() {
  const products = loadAllItems()
  return new Map(
    products.map(product => {
      return [product.barcode, product]
    }))
}

function renderRowReceipt(product: { unit: string; price: number; name: string; barcode: string }, qty: number, subtotal: number) {
  return `Name：${product.name}，Quantity：${qty} ${product.unit}s，Unit：${product.price.toFixed(2)}(yuan)，Subtotal：${subtotal.toFixed(2)}(yuan)`
}

function renderTitle(receipt: string) {
  const title = '***<store earning no money>Receipt ***'
  receipt += title
  return receipt
}

function calculateSubtotal(product: { unit: string; price: number; name: string; barcode: string }, qty: number,isDiscount:boolean) {
  if (isDiscount){
    const noDiscountQty = qty%3
    const discountQty = qty - noDiscountQty
    return discountQty/3*product.price*2 + noDiscountQty*product.price
  }
  return product.price * qty
}

function renderRow(tag: string, productMap: Map<string, { unit: string; price: number; name: string; barcode: string }>, receipt: string, buyTwoGetOneFreeTags: string[]) {
  const tagInfo = tag.split('-')
  const product = productMap.get(tagInfo[0])
  const qty = tagInfo.length > 1 ? Number(tagInfo[1]) : 1
  if (product === undefined) {
    throw new Error('error item')
  }
  receipt += '\n'
  receipt += renderRowReceipt(product, qty, calculateSubtotal(product, qty, buyTwoGetOneFreeTags.includes(tagInfo[0])))
  return receipt
}

export function printReceipt(tags: string[]): string {
  const productMap = loadProductMap()
  const promotions = loadPromotions()
  const buyTwoGetOneFreeTags = promotions[0].barcodes
  let receipt = ''
  receipt = renderTitle(receipt)
  tags.map(tag => {

    receipt = renderRow(tag, productMap, receipt,buyTwoGetOneFreeTags)
  })
  return receipt
}

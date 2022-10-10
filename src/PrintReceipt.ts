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

function renderTitle(receipt: { total: number; discountTotal: number; receipt: string }) {
  const title = '***<store earning no money>Receipt ***'
  receipt.receipt += title
}

function calculateSubtotal(product: { unit: string; price: number; name: string; barcode: string }, qty: number, isDiscount: boolean) {
  if (isDiscount) {
    const noDiscountQty = qty % 3
    const discountQty = qty - noDiscountQty
    return {
      subtotal: discountQty / 3 * product.price * 2 + noDiscountQty * product.price,
      discount: discountQty / 3 * product.price
    }
  }
  return {subtotal:product.price * qty,discount:0}
}
function calculateSub(product: { unit: string; price: number; name: string; barcode: string }, qty: number, isDiscount: boolean) {
  if (isDiscount) {
    const noDiscountQty = qty % 3
    const discountQty = qty - noDiscountQty
    return discountQty / 3 * product.price * 2 + noDiscountQty * product.price
  }
  return product.price * qty
}

function renderRow(tag: string, productMap: Map<string, { unit: string; price: number; name: string; barcode: string }>, result: { total: number; discountTotal: number; receipt: string }, buyTwoGetOneFreeTags: string[]) {
  const tagInfo = tag.split('-')
  const product = productMap.get(tagInfo[0])
  const qty = tagInfo.length > 1 ? Number(tagInfo[1]) : 1
  if (product === undefined) {
    throw new Error('error item')
  }
  result.receipt += '\n'
  const calculateResult = calculateSubtotal(product, qty, buyTwoGetOneFreeTags.includes(tagInfo[0]))
  result.total += calculateResult.subtotal
  result.discountTotal += calculateResult.discount
  result.receipt += renderRowReceipt(product, qty, calculateResult.subtotal)
}

export function printReceipt(tags: string[]): string {
  const productMap = loadProductMap()
  const promotions = loadPromotions()
  const buyTwoGetOneFreeTags = promotions[0].barcodes
  const result = {
    receipt: '',
    total: 0,
    discountTotal: 0,
  }

  renderTitle(result)
  tags.map(tag => {
    renderRow(tag, productMap, result, buyTwoGetOneFreeTags)
  })
  const footer = `
----------------------
Total：${result.total.toFixed(2)}(yuan)
Discounted prices：${result.discountTotal.toFixed(2)}(yuan)
********************** `
  result.receipt+=footer
  return result.receipt
}

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
  return {subtotal: product.price * qty, discount: 0}
}

function renderRow(product: { unit: string; price: number; name: string; barcode: string }, qty: number, productMap: Map<string, { unit: string; price: number; name: string; barcode: string }>, result: { total: number; discountTotal: number; receipt: string }, buyTwoGetOneFreeTags: string[]) {

  result.receipt += '\n'
  const calculateResult = calculateSubtotal(product, qty, buyTwoGetOneFreeTags.includes(product.barcode))
  result.total += calculateResult.subtotal
  result.discountTotal += calculateResult.discount
  result.receipt += renderRowReceipt(product, qty, calculateResult.subtotal)
}

function renderFooter(result: { total: number; discountTotal: number; receipt: string }) {
  const footer = `
----------------------
Total：${result.total.toFixed(2)}(yuan)
Discounted prices：${result.discountTotal.toFixed(2)}(yuan)
**********************`
  result.receipt += footer
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

  const tagLines = tags.map(tag => {
    const tagInfo = tag.split('-')
    const product = productMap.get(tagInfo[0])
    const qty = tagInfo.length > 1 ? Number(tagInfo[1]) : 1
    if (product === undefined) {
      throw new Error('error item')
    }
    return {barcode: product.barcode, product: product, qty: qty}
  })
  const itemMap = new Map<string, { product: { unit: string; price: number; name: string; barcode: string }, qty: number }>()

  tagLines.forEach(line => {
    if (itemMap.has(line.barcode)) {
      let currentQty = itemMap.get(line.barcode)
      if (currentQty === undefined) {
        currentQty = {product: line.product, qty: 0}
      }
      itemMap.set(line.barcode, {product: line.product, qty: line.qty + currentQty.qty})
    } else {
      itemMap.set(line.barcode, {product: line.product, qty: line.qty})
    }
  })
  itemMap.forEach((productInfo, barcode) => {
    renderRow(productInfo.product, productInfo.qty, productMap, result, buyTwoGetOneFreeTags)
  })
  renderFooter(result)
  return result.receipt
}

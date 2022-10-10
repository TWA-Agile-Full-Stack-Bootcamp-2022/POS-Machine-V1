import {loadAllItems} from './Dependencies'

function loadProductMap() {
  const products = loadAllItems()
  return new Map(
    products.map(product => {
      return [product.barcode, product]
    }))
}

function renderRowReceipt(product: { unit: string; price: number; name: string; barcode: string }) {
  return `Name：${product.name}，Quantity：1 ${product.unit}s，Unit：${product.price.toFixed(2)}(yuan)`
}

function renderTitle(receipt: string) {
  const title = '***<store earning no money>Receipt ***'
  receipt += title
  return receipt
}

export function printReceipt(tags: string[]): string {
  const productMap = loadProductMap()
  let receipt = ''
  receipt = renderTitle(receipt)
  tags.map(tag => {
    const product = productMap.get(tag)
    if (product === undefined) {
      throw new Error('error item')
    }
    receipt += '\n'
    receipt += renderRowReceipt(product)
  })
  return receipt
}

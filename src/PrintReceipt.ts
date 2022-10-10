import {loadAllItems} from './Dependencies'

function loadProductMap() {
  const products = loadAllItems()
  return new Map(
    products.map(product => {
      return [product.barcode, product]
    }))
}

export function printReceipt(tags: string[]): string {
  const productMap = loadProductMap()
  for (const index in tags) {
    if (!productMap.has(tags[index])) {
      throw new Error('error item')
    }
  }
  return '***<store earning no money>Receipt ***'
}

import {loadAllItems} from './Dependencies'

function loadProductMap() {
  const products = loadAllItems()
  return new Map(
    products.map(product => {
      return [product.barcode, product]
    }))
}

function checkTagInProducts(productMap: Map<string, { unit: string; price: number; name: string; barcode: string }>, tag: string) {
  if (!productMap.has(tag)) {
    throw new Error('error item')
  }
}

export function printReceipt(tags: string[]): string {
  const productMap = loadProductMap()
  tags.map(tag => checkTagInProducts(productMap, tag))
  return '***<store earning no money>Receipt ***'
}

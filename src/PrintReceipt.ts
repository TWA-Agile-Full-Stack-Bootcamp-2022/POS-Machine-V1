import {loadAllItems, loadPromotions} from './Dependencies'

export function printReceipt(tags: string[]): string {
  const products = loadAllItems()
  const productMap = new Map(
    products.map(product => {
      return [product.barcode, product]
    }))
  for (const index in tags) {
    if (!productMap.has(tags[index])) {
      throw new Error('error item')
    }
  }
  return '***<store earning no money>Receipt ***'
}

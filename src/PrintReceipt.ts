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
  let receipt=''
  const title = '***<store earning no money>Receipt ***'
  receipt+=title
  tags.map(tag =>{
    const product = productMap.get(tag)
    if (product===undefined){
      throw new Error('error item')
    }
    receipt+='\n'
    receipt+=`Name：${product.name}，Quantity：1 ${product.unit}s，Unit：${product.price.toFixed(2)}(yuan)`
  })
  return receipt
}

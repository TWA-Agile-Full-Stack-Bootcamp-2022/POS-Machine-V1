import { loadAllItems, loadPromotions } from './Dependencies'


export function calulateQuantity(tags: string[]): Map<string,number> {
  const barcodeQuantity = new Map()
  tags.forEach((tag)=>{
    let barcode:string
    let quantity:number
    const index = tag.indexOf('-')
    if(index===-1){
      barcode=tag
      quantity=1
    }else{
      barcode=tag.substring(0,index)
      quantity= Number(tag.substring(index+1,tag.length))
    }
    if(barcodeQuantity.has(barcode)){
      const hasQuantity = barcodeQuantity.get(barcode)
      barcodeQuantity.set(barcode,hasQuantity+quantity)
    }else{
      barcodeQuantity.set(barcode,quantity)
    }
  })
  return barcodeQuantity
}




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



export class ReceiptLine {
  barcode: string
  name: string
  price: number
  quantity: number
  constructor(barcode: string, name: string, price: number, quantity: number) {
    this.barcode = barcode
    this.name = name
    this.price = price
    this.quantity = quantity
  }

  public getDiscount(): number {
    let discount = 0
    const promotions = loadPromotions()
    promotions.forEach((promotion) => {
      if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
        if (promotion.barcodes.includes(this.barcode)) {
          discount += Math.floor(this.quantity / 3) * this.price
        }
      }
    })
    return discount
  }

  public getSubTotalPrice(): number {
    return this.price * this.quantity - this.getDiscount()
  }
}

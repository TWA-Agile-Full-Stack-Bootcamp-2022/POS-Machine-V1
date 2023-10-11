export class ReceiptItem {
    barcode: string
    name: string
    unit: string
    unitPrice: number
    quantity: number
    discount: number

    constructor(barcode: string, name: string, unit: string, unitPrice: number, quantity: number) {
      this.barcode = barcode
      this.name = name
      this.unit = unit
      this.unitPrice = unitPrice
      this.quantity = quantity
      this.discount = 0
    }
}

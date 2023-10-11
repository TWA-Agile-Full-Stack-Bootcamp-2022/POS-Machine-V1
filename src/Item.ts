export class Item {
    name: string
    barcode: string
    unit: string
    price: number
    constructor(barcode: string, name: string, unit: string, price: number ) {
      this.unit = unit
      this.price = price
      this.name = name
      this.barcode = barcode
    }
}


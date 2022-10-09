export class ShoppingCartItem {
    barcode: string
    name: string
    unit: string
    quantity: number
    unitPrice: number
    totalPrice: number
    discountPrice: number = 0

    constructor(barcode: string,
                name: string,
                unit: string,
                unitPrice: number,
                quantity: number,
                totalPrice: number) {
        this.barcode = barcode;
        this.name = name;
        this.unit = unit;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }
}

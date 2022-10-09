export interface ShoppingCartItem {
    barcode: string
    name: string
    unit: string
    quantity: number
    unitPrice: number
    totalPrice: number
    discountPrice?: number
}

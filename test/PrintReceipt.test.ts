import { calculatePromotions, getItem, groupingItems, printItemList, printReceipt } from '../src/PrintReceipt'
import { ShoppingCartItem } from "../src/ShoppingCartItem";
import { Item } from "../src/Item";
// * task 1: should get barcode with quantity map when grouping items given input list
// * task 2: should return item entity when item exists given item barcode
// * ~~task 2-1: should throw exception when item ?~~
// * task 3: should get ShoppingCartItem total price equals unit price * 2 when toShoppingCartItem given item entity and quantity is 2
// *** task 4: should get ShoppingCartItem total price equals unit price * 1 when toShoppingCartItem given item entity and quantity is null ***
// * task 5: should get ShoppingCartItem subtotal unit price * 2 when calculatePromotions given item with BUY_TWO_GET_ONE_FREE type quantity is 3
// * task 6: should get ShoppingCartItem subtotal unit price * 2 when calculatePromotions given item with BUY_TWO_GET_ONE_FREE type quantity is 2
// * task 7: should get shopping cart items string when printItemList given shopping cart list
// * task 8: should get shopping cart items total contents when printTotalContent given shopping cart items
// * task 9: should print list contents successful when printReceipt given input list


function toShoppingCartItem(item: Item, quantity: number) {
    const shoppingCartItem = {} as ShoppingCartItem;
    shoppingCartItem.name = item.name
    shoppingCartItem.barcode = item.barcode
    shoppingCartItem.unit = item.unit
    shoppingCartItem.unitPrice = item.price
    shoppingCartItem.quantity = quantity
    shoppingCartItem.totalPrice = item.price * quantity
    return shoppingCartItem;
}

describe('printReceipt', () => {
    it('should print receipt with promotion when print receipt', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ]

        const expectText = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`

        expect(printReceipt(tags)).toEqual(expectText)
    })

    it('should get barcode with quantity map when grouping items given input list', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ]

        expect(groupingItems(tags)).toEqual(new Map([
            ['ITEM000001', 5],
            ['ITEM000003', 2.5],
            ['ITEM000005', 3],
        ]))
    })

    it('should return item entity when item exists given item barcode', () => {
        const barcode = 'ITEM000001'

        expect(getItem(barcode)).toEqual({
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottle',
            price: 3.00
        })
    })

    it('should get ShoppingCartItem total price equals unit price * 2 when toShoppingCartItem given item entity and quantity is 2', () => {
        const item = {
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottle',
            price: 3.00
        }
        const quantity = 3;

        const shoppingCartItem: ShoppingCartItem = toShoppingCartItem(item, quantity)
        expect(shoppingCartItem.barcode).toEqual(item.barcode)
        expect(shoppingCartItem.name).toEqual(item.name)
        expect(shoppingCartItem.unit).toEqual(item.unit)
        expect(shoppingCartItem.quantity).toEqual(quantity)
        expect(shoppingCartItem.unitPrice).toEqual(item.price)
        expect(shoppingCartItem.totalPrice).toEqual(item.price * 3)
    })


    it('should get ShoppingCartItem subtotal unit price * 2 when calculatePromotions given item with BUY_TWO_GET_ONE_FREE type quantity is 2', () => {
        const shoppingCartItem: ShoppingCartItem = {
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottle',
            unitPrice: 3.00,
            quantity: 3,
            totalPrice: 9
        };

        const cartItem: ShoppingCartItem = calculatePromotions(shoppingCartItem)
        expect(cartItem.barcode).toEqual(shoppingCartItem.barcode)
        expect(cartItem.name).toEqual(shoppingCartItem.name)
        expect(cartItem.unit).toEqual(shoppingCartItem.unit)
        expect(cartItem.quantity).toEqual(shoppingCartItem.quantity)
        expect(cartItem.unitPrice).toEqual(shoppingCartItem.unitPrice)
        expect(cartItem.totalPrice).toEqual(shoppingCartItem.unitPrice * 3)
        expect(cartItem.discountPrice).toEqual(shoppingCartItem.unitPrice)
    })

    it('should get ShoppingCartItem subtotal unit price * 2 when calculatePromotions given item with BUY_TWO_GET_ONE_FREE type quantity is 2', () => {
        const shoppingCartItem: ShoppingCartItem = {
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottle',
            unitPrice: 3.00,
            quantity: 2,
            totalPrice: 6
        };

        const cartItem: ShoppingCartItem = calculatePromotions(shoppingCartItem)
        expect(cartItem.barcode).toEqual(shoppingCartItem.barcode)
        expect(cartItem.name).toEqual(shoppingCartItem.name)
        expect(cartItem.unit).toEqual(shoppingCartItem.unit)
        expect(cartItem.quantity).toEqual(shoppingCartItem.quantity)
        expect(cartItem.unitPrice).toEqual(shoppingCartItem.unitPrice)
        expect(cartItem.totalPrice).toEqual(shoppingCartItem.unitPrice * 2)
        expect(cartItem.discountPrice).toEqual(0)
    })

    it('should get shopping cart items string when printItemList given shopping cart list', () => {
        const shoppingCartItems: ShoppingCartItem[] = [{
            barcode: 'ITEM000001',
            name: 'Sprite',
            unit: 'bottle',
            unitPrice: 3.00,
            quantity: 5,
            totalPrice: 15,
            discountPrice: 3
        }, {
            barcode: 'ITEM000003',
            name: 'Litchi',
            unit: 'pound',
            unitPrice: 15.00,
            quantity: 2.5,
            totalPrice: 37.5,
            discountPrice: 0
        }];

        const list: string = printItemList(shoppingCartItems)
        expect(list).toEqual("name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)\n" +
            "name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)")
    })

})

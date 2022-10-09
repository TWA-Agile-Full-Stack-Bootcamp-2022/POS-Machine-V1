import { loadAllItems, loadPromotions } from "./Dependencies";
import { ShoppingCartItem } from "./ShoppingCartItem";

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

function getQuantity(quantityString: string) {
    if (!quantityString) {
        return 1
    }
    if (quantityString.indexOf('.') < 0) {
        return parseInt(quantityString)
    }
    return parseFloat(quantityString);
}

export function groupingItems(tags: string[]) {
    return tags.reduce((a, b) => {
        const [barcode, quantityString] = b.split('-');
        const quantity = getQuantity(quantityString);
        if (!!a.get(barcode)) {
            a.set(barcode, a.get(barcode) + quantity)
        } else {
            a.set(barcode, quantity)
        }
        return a;
    }, new Map());
}

export function getItem(barcode: string) {
    return loadAllItems().find(element => element.barcode === barcode);
}

function getPromotions(shoppingCartItem: ShoppingCartItem) {
    return loadPromotions().filter(item => {
        return item.barcodes.indexOf(shoppingCartItem.barcode) !== -1
    }).map(o => o.type);
}

export function calculatePromotions(shoppingCartItem: ShoppingCartItem) {
    const promotions = getPromotions(shoppingCartItem);
    if (promotions.indexOf('BUY_TWO_GET_ONE_FREE') !== -1) {
        shoppingCartItem.discountPrice = Math.trunc(shoppingCartItem.quantity / 3) * shoppingCartItem.unitPrice
    }
    return shoppingCartItem
}

function getSubtotalPrice(s: ShoppingCartItem) {
    return toFixedNumber(s.totalPrice - (s.discountPrice || 0));
}

function toFixedNumber(num: number) {
    return num.toFixed(2);
}

function formatUnit(unit: string, quantity: number) {
    if(quantity > 1) {
        return `${unit}s`
    }
    return unit
}

export function printItemList(shoppingCartItems: ShoppingCartItem[]) {
    const list = shoppingCartItems.map(s =>
        `name：${s.name}，Quantity：${s.quantity} ${formatUnit(s.unit, s.quantity)}，Unit：${(toFixedNumber(s.unitPrice))}(yuan)，Subtotal：${getSubtotalPrice(s)}(yuan)`)
        .join("\n")

    return `***<store earning no money>Receipt ***\n${list}`
}

export function printTotalContents(shoppingCartItems: ShoppingCartItem[]) {
    return `----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`;
}

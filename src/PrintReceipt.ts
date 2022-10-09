import { loadAllItems, loadPromotions } from "./Dependencies";
import { ShoppingCartItem } from "./ShoppingCartItem";
import { Item } from "./Item";

export function printReceipt(tags: string[]): string {
    const itemsMap = groupingItems(tags);
    const shoppingCartItems = Array.from(itemsMap.keys())
        .map(getItem)
        .map((item: Item) => toShoppingCartItem(item, itemsMap.get(item.barcode)))
        .map(calculatePromotions);
    return printItemList(shoppingCartItems) + '\n'+ printTotalContents(shoppingCartItems);
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

export function getItem(barcode: string): Item {
    const item = loadAllItems().find(element => element.barcode === barcode);
    if (!item) {
        throw new Error(`not found barcode ${barcode}`);
    }
    return item
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
        `Name：${s.name}，Quantity：${s.quantity} ${formatUnit(s.unit, s.quantity)}，Unit：${(toFixedNumber(s.unitPrice))}(yuan)，Subtotal：${getSubtotalPrice(s)}(yuan)`)
        .join("\n")

    return `***<store earning no money>Receipt ***\n${list}`
}

function sumSubtotalPrice(shoppingCartItems: ShoppingCartItem[]) {
    return toFixedNumber(shoppingCartItems.reduce(
        (a, b) => a + (b.totalPrice - b.discountPrice), 0));
}

function sumDiscountPrice(shoppingCartItems: ShoppingCartItem[]) {
    return toFixedNumber(shoppingCartItems.reduce(
        (a, b) => a + b.discountPrice, 0));
}

export function printTotalContents(shoppingCartItems: ShoppingCartItem[]) {
    return `----------------------
Total：${(sumSubtotalPrice(shoppingCartItems))}(yuan)
Discounted prices：${(sumDiscountPrice(shoppingCartItems))}(yuan)
**********************`;
}

export function toShoppingCartItem(item: Item, quantity: number) {
    return new ShoppingCartItem(item.barcode, item.name, item.unit, item.price, quantity, item.price * quantity);
}

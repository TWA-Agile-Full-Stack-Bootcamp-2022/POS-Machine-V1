import {loadAllItems, loadPromotions} from './Dependencies'

interface Quantity {
  value: number;
  unit: string
}

interface ReceiptItem {
  name: string;
  quantity: Quantity;
  price: number;
  subtotal: number;
  discountedPrice: number
}

interface Item {
  barcode: string;
  name: string;
  unit: string;
  price: number;
}

interface Tag {
  barcode: string;
  quantity: number;
  item: Item;
  promotionType?: string
}

export function printReceipt(tags: string[]): string {
  const parsedTags: Tag[] = parseTags(tags)
  const aggregatedTags: Tag[] = aggregateTags(parsedTags)
  const receiptItems: ReceiptItem[] = generateReceiptItems(aggregatedTags)
}
function generateReceiptItems(aggregatedTags: Tag[]): ReceiptItem[] {
  const calculateDiscountedSubtotal = (quantity: number, price: number, promotionType: string| undefined): number =>  {
    if (promotionType === 'BUY_TWO_GET_ONE_FREE' && quantity >=2 ) {
      return (quantity - 1) * price
    } else {
      return quantity * price
    }
  }
  return aggregatedTags.map(tag => {
    const discountedSubtotal = calculateDiscountedSubtotal(tag.quantity, tag.item.price, tag.promotionType)
    return {
      name: tag.item.name,
      quantity: {
        value: tag.quantity,
        unit: tag.quantity>1? `${tag.item.unit}s`: tag.item.unit
      },
      price: tag.item.price,
      subtotal: discountedSubtotal,
      discountedPrice: tag.quantity * tag.item.price - discountedSubtotal
    }
  })
}

function aggregateTags(parsedTags: Tag[]): Tag[] {
  const aggregatedTags: Tag[] = []
  for(const tag of parsedTags) {
    const aggregator: Tag | undefined = aggregatedTags.find(t => t.barcode === tag.barcode)
    aggregator === undefined? aggregatedTags.push(tag): aggregator.quantity += tag.quantity
  }
  return aggregatedTags
}

function parseTags(tags: string[]): Tag[] {
  const parseQuantity = (quantityStr: string) => {
    const quantity = parseFloat(quantityStr)
    if (isNaN(quantity)) {
      throw new Error('Not a valid quantity')
    }
    return quantity
  }
  const allItems = loadAllItems()
  const promotions = loadPromotions()
  return tags.map(tag => {
    const parts = tag.split('-')
    const barcode = parts[0]
    const item = allItems.find(item => item.barcode === barcode)
    if(item === undefined) {
      throw new Error(`The barcode ${tag} is not registered`)
    }
    const promotion = promotions.find(promotion => promotion.barcodes.includes(barcode))
    return {
      barcode: barcode,
      quantity: parts.length > 1? parseQuantity(parts[1]):1,
      item: item,
      promotionType: promotion?.type
    }
  })
}
}

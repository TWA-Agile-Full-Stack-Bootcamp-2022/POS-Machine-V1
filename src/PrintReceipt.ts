import {loadAllItems, loadPromotions} from './Dependencies'

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

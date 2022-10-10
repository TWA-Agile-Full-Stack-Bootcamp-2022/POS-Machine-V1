import {printReceipt} from '../src/PrintReceipt'

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

  it('should render title when print receipt given any input', () => {
    const tags = [
      'ITEM000001',
    ]
    expect(printReceipt(tags)).toContain('***<store earning no money>Receipt ***')
  })
  it('should throw error when print receipt given item not in products', () => {
    const tags = [
      'ERRORITEM000001'
    ]
    expect(() => printReceipt(tags)).toThrow(new Error('error item'))
  })
  it('should render item name and get unit price when print receipt given item in product and qty 1', () => {
    const tags = [
      'ITEM000000',
    ]
    expect(printReceipt(tags)).toContain('Name：Coca-Cola，Quantity：1 bottles，Unit：3.00(yuan)')
  })
  it('should render by qty from tag when print receipt given tags ITEM000000-2', () => {
    const tags = [
      'ITEM000000-2',
    ]
    expect(printReceipt(tags)).toContain('Name：Coca-Cola，Quantity：2 bottles，Unit：3.00(yuan)')
  })

  it('should count subtotal price from tag when print receipt given tags ITEM000003-2', () => {
    const tags = [
      'ITEM000003-2',
    ]
    expect(printReceipt(tags)).toContain('Name：Litchi，Quantity：2 pounds，Unit：15.00(yuan)，Subtotal：30.00(yuan)')
  })

  it('should count subtotal price from tag when print receipt given tags ITEM000000-4 who has discount of buy two get one free', () => {
    const tags = [
      'ITEM000000-4',
    ]
    expect(printReceipt(tags)).toContain('Name：Coca-Cola，Quantity：4 bottles，Unit：3.00(yuan)，Subtotal：9.00(yuan)')
  })

  it('should render footer when print receipt given tags ITEM000000-4 and ITEM000003-2', () => {
    const tags = [
      'ITEM000000-4',
      'ITEM000003-2'
    ]
    expect(printReceipt(tags)).toContain(`----------------------
Total：39.00(yuan)
Discounted prices：3.00(yuan)
**********************`)
  })

  it('should merge same item when print receipt given tags ITEM000003 and ITEM000003', () => {
    const tags = [
      'ITEM000003',
      'ITEM000003',
    ]
    expect(printReceipt(tags)).toContain('Name：Litchi，Quantity：2 pounds，Unit：15.00(yuan)，Subtotal：30.00(yuan)')
  })
})

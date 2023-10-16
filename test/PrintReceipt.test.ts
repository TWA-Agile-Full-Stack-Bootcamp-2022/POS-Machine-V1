import {printReceipt} from '../src/PrintReceipt'
import { ReceiptLine } from '../src/PrintReceipt'

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

  it('6 chair should get 20 discount',()=>{

    const line = new ReceiptLine('ITEM000001','chair',10,6)

    const discount = line.getDiscount()

    expect(discount).toBe(20)
  })

  it('total price for 6 chairs should be 40',()=>{
    const line = new ReceiptLine('ITEM000001','chair',10,6)
    const subTotal = line.getSubTotalPrice()
    expect(subTotal).toBe(40)
  })

})

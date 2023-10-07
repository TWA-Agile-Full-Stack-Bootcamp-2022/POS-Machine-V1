import {printReceipt} from '../src/PrintReceipt'

type TestCase = {
  name: string
  tags: string[]
  expected?: string
}

const happyTestCases: TestCase[] = [
  {
    name: 'should print receipt with promotion when print receipt',
    tags: [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ],
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
]

describe('printReceipt', () => {
  happyTestCases.forEach(testCase => {
    it(testCase.name, () => {
      // given
      const tags = testCase.tags

      // when
      const receipt = printReceipt(tags)

      // then
      expect(receipt).toEqual(testCase.expected)
    })
  })
  })
})

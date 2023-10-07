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
    expected: `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
  },
  {
    name: 'should print receipt without promotion when print receipt',
    tags: [
      'ITEM000003-100',
      'ITEM000004-200',
    ],
    expected: `***<store earning no money>Receipt ***
Name：Litchi，Quantity：100 pounds，Unit：15.00(yuan)，Subtotal：1500.00(yuan)
Name：Battery，Quantity：200 as，Unit：2.00(yuan)，Subtotal：400.00(yuan)
----------------------
Total：1900.00(yuan)
Discounted prices：0.00(yuan)
**********************`
  },
]

const badTestCases: TestCase[] = [
  {
    name: 'should throw error when print receipt given the tag contains invalid quantity',
    tags: [
      'ITEM000001-a',
    ],
  },
  {
    name: 'should throw error when print receipt given the tag contains unregistered barcode',
    tags: [
      'ITEM00000999',
    ],
  }
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

  badTestCases.forEach(testCase => {
    it(testCase.name, () => {
      // given
      const tags = testCase.tags

      // when
      const print = () => printReceipt(tags)

      // then
      expect(print).toThrow()
    })
  })
})

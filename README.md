# Business Requirement

The store will use the cash register (POS) systems when shopping settlement, This cashier will settle and print the receipt (Receipt) according to the item in the customer's shopping cart (Cart)  And ongoing promotions at the store（Promotion）at the time of settlement .

The store is offering a "buy two get one free" offer for some products. One item has one and only one kind of promotion at the same time.

We need to implement a function called `printReceipt`, This function can input data of the specified format as a parameter and then output the text of the receipt in the browser console.

Input format（example）：

```javascript
[
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
]
```

Which for 'ITEM000003-2'，Before "-" is the standard barcode, After the "-" is the quantity, The number may be a decimal.
When we buy items that we need to weigh，These tags （Tag） will be generated by the weighing machine, The cash register is responsible for identifying the receipt。


List Contents（example）：

```
***<store earning no money>Receipt ***
Name：Coca-Cola，Quantity：3 bottles，Unit：3.00(yuan)，Subtotal：6.00(yuan)
Name：Badminton，Quantity：5，Unit：1.00(yuan)，Subtotal：4.00(yuan)
Name：Apple，Quantity：2 pounds，Unit：5.50(yuan)，Subtotal：11.00(yuan)
----------------------
Total：21.00(yuan)
Discounted prices：4.00(yuan)
**********************
```



## Hints

1. Use the `loadAllItems()` method to get all the items, This method returns the result as an array containing the item objects.（example）：

   ```
   [ item1, item2, item3, ..., itemN ]
   ```

2. The structure of each products object is as follows（example）：

   ```javascript
   {
      barcode: 'ITEM000000',
      name: 'Coca-Cola',
      unit: 'bottle',
      price: 3.00
   }
   ```

3. Use the `loadPromotions()` method to get all the promotion information, This method returns the result as an array containing the promotion information object (example):

   ```javascript
   [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001'
        ]
      },
      {
        type: 'OTHER_PROMOTION',
        barcodes: [
          'ITEM000003',
          'ITEM000004'
        ]
      }
   ]
   ```

# Practice Requirement

1. Please draw the whole tasking diagram.
![img.png](img.png)
2. Please declare all the functions according to your diagram.
3. Please write a test case following given...when...then pattern for a leaf
   block of the diagram. Then implement the block to pass the test.
```
given: print any()
when: printReceipt
then: return contains ***<store earning no money>Receipt *** 
```

```angular2html
given:  item not in loadAllItems
when: printReceipt
then: thrown error item 
```

```markdown
given: item in products for example ITEM000000
when: printReceipt
then: return contains Name：Coca-Cola，Quantity：1 bottles，Unit：3.00(yuan)
```
```markdown
given: item in products for example ITEM000000-2
when: printReceipt
then: return contains Name：Coca-Cola，Quantity：2 bottles，Unit：3.00(yuan)
```
4. Please repeat step 3 until all functions are implemented.

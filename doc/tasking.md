# Tasking
1. Parse tags from the input
    - Input: tags: string[]
    - Output: parsedTags: Tag[]
1. Aggregate parsed tags as there might be a few duplicated items
    - Input: parsedTags: Tag[]
    - Output: aggregatedTags: Tag[]
1. Generate receipt items based on the aggregated tags.
    - Input: aggregatedTags: Tag[]
    - Output: receiptItems: ReceiptItem[]
1. Renders receipt items as a string in the specified format
    - Input: receiptItems: ReceiptItem[]
    - Output: receipt: string

# Context Map

![Alt text](assets/tasking.svg)
```plantuml
@startuml

' Sequence Diagram: https://plantuml.com/sequence-diagram

skinparam sequence {
    ParticipantBackgroundColor Gainsboro
    ParticipantBorderColor Transparent
    LifeLineBorderColor Transparent
}
' skinparam SequenceMessageAlign reverseDirection
' skinparam SequenceMessageAlign center

hide footbox

-> printReceipt: tags: string[]
activate printReceipt #Gainsboro

create parseTags
printReceipt -> parseTags: tags: string[]
activate parseTags #Gainsboro
return parsedTags: Tag[]

create aggregateTags
printReceipt -> aggregateTags: parsedTags: Tag[]
activate aggregateTags #Gainsboro
return aggregatedTags: Tag[]

create generateReceiptItems
printReceipt -> generateReceiptItems: aggregatedTags: Tag[]
activate generateReceiptItems #Gainsboro
return receiptItems: ReceiptItem[]

create renderReceipt
printReceipt -> renderReceipt: receiptItems: ReceiptItem[]
activate renderReceipt #Gainsboro
return receipt: string

<- printReceipt: receipt: string
deactivate printReceipt

@enduml

```

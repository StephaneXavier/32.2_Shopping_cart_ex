const items = require('./fakeDb')

function updateItems(itemName, newName, newPrice){
    const updatedItem = {}
    for(let item of items){
        if (item.name === itemName){
            item.name = newName;
            item.price = newPrice
            updatedItem.name= newName;
            updatedItem.price = newPrice
        }
    }
    return updatedItem
}

module.exports = updateItems

const express = require('express')
const app = express()

const items = require('./fakeDb')

const updateItems = require('./helpers')

const ExpressError = require('./expressErrors')

app.use(express.json())

app.get('/items', (req, res) => {
    res.send(items)
})

app.post('/items', (req, res, next) => {
    try {
        const newItem = req.body
        if (!req.body.name || !req.body.price) throw new ExpressError('Please follow format {name:itemName,price:itemPrice}', 400);

        items.push(newItem);
        res.send({ "added": { newItem } })

    } catch (e) {
        return next(e)
    }

})

// If items.find return undefined, then throw error. Else return the found (object) elem (which has both name and price in it)
app.get('/items/:name', (req, res, next) => {
    try {
        const itemName = req.params.name;
        const itemResp = items.find(elem => elem.name === itemName)
        if (!itemResp) throw new ExpressError('Item not found', 400);

        res.send(itemResp)

    } catch (e) {
        return next(e)
    }
})

app.patch('/items/:name', (req, res, next) => {
    try {
        const itemName = req.params.name;
        const itemResp = items.find(elem => elem.name === itemName);
        if (!itemResp) throw new ExpressError('Item does not exist', 400);

        const newName = req.body.name;
        const newPrice = req.body.price;
        const updatedItem = updateItems(itemName, newName, newPrice)

        res.send({ "updated": updatedItem })
    } catch (e) {
        return next(e)
    }
})

app.delete('/items/:name', (req, res, next) => {
    try {
        const itemName = req.params.name;
        const itemResp = items.find(elem => elem.name === itemName);

        console.log(itemResp)
        if (!itemResp) throw new ExpressError('Item does not exist', 400);
        const index = items.findIndex(elem => elem.name === itemName)
        items.splice(index, 1)
        res.send({ message: "Deleted" })
    }
    catch (e) {
        return next(e)
    }
})


// handle not found, then pass onto generic error handler below
app.use((req, res, next) => {
    const notFoundError = new ExpressError('Route not found', 404)
    return next(notFoundError)
})

// generic error handler
app.use((err, req, res, next) => {
    let status = err.status || 500
    let message = err.message

    return res.status(status).json({ error: { message, status } })
})

module.exports = app
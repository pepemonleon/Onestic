const neatCsv = require('neat-csv');
const fs = require('fs')

async function getCsvItems(filePath) {
    let file = fs.readFileSync(filePath, 'utf8')
    let json = await neatCsv(file);

    let items = []
    for (let value in json) {
        items.push(json[value])
    }

    return items
}

//Parse customers.csv to array
async function parseCustomers() {
    return getCsvItems('data/customers.csv')
}

//Parse products.csv to array
async function parseProducts() {
    return getCsvItems('data/products.csv')
}

//Parse orders.csv to array
async function parseOrders() {
    return getCsvItems('data/orders.csv')
}

async function mergeOrderAndPrices() {
    let products = await parseProducts()
    let orders = await parseOrders()

    console.log(products)
}

mergeOrderAndPrices()

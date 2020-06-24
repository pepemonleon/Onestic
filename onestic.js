const neatCsv = require('neat-csv');
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function getCsvItems(filePath) {
    let file = fs.readFileSync(filePath, 'utf8')    //Library read the file csv
    let json = await neatCsv(file);

    let items = []
    for (let value in json) {
        items.push(json[value])     //Loop through the file and enter the json in the array
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

//Compare productId with te whole product.
function getProductById(productId, products) {
    let product
    products.forEach(p => {
        if (p.id == productId) {
            product = p
        }
    })

    return product
}

async function getOrdersTotal() {
    let orders = await parseOrders()        //Save data orders
    let products = await parseProducts()    //Save data products

    let result = []

    orders.forEach(order => {
        let total = 0
        let productsIds = order.products.split(" ")     //Separate products id

        productsIds.forEach(productId => {
            let product = getProductById(productId, products)
            if (product != null) {
                total += parseFloat(product.cost) //Convert product.cost to Float
            }
        })

        result.push({"id": order.id, "customer": order.customer, "euros": total})   //Get from order,cs id, customers and total euros
    })

    return result
}

//Task 1
async function task1() {
    let result = await getOrdersTotal()

    await writeCsvTask1(result)
}

//Create the csv file for Task 1
async function writeCsvTask1(result) {
    const csvWriter = createCsvWriter({
        path: 'data/order_prices.csv',
        header: [
            {id: 'id', title: 'ORDER ID'},
            {id: 'euros', title: 'EUROS'}
        ]
    });

    await csvWriter.writeRecords(result)
}

//Task 2
async function task2() {
    let products = await parseProducts()    //Save data products
    let orders = await parseOrders()        //Save data orders

    let result = []

    products.forEach(product => {
        let customersIds = new Set()

        orders.forEach(order => {
            let productsIds = order.products.split(" ")     //Separate products id

            if (product.id in productsIds) {
                customersIds.add(parseInt(order.customer))  //Convert customersId (string) to int
            }
        })

        let ids = Array.from(customersIds).sort(function (a, b) { //Sort customers_ids from least to greatest
            return a - b
        });

        result.push({"id": product.id, "customer_ids": ids.join(' ')})
    })

    await writeCsvTask2(result)
}

//Create the csv file for Task 2
async function writeCsvTask2(result) {
    const csvWriter = createCsvWriter({
        path: 'data/product_customers.csv',
        header: [
            {id: 'id', title: 'PRODUCT ID'},
            {id: 'customer_ids', title: 'CUSTOMER IDS'}
        ]
    });

    await csvWriter.writeRecords(result)
}

//Task 3
async function task3() {
    let customers = await parseCustomers()  //Save data customers
    let ordersTotal = await getOrdersTotal()    //Get from order.cs id, customers and total euros

    let result = []
    customers.forEach(customer => {
        let total = 0
        ordersTotal.forEach(order => {
            if (customer.id == order.customer) {
                total += order.euros
            }
        })
        result.push({
            "id": customer.id,
            "firstname": customer.firstname,
            "lastname": customer.lastname,
            "total_euros": total
        })
    })

    result = result.sort(function (a, b) {  //Sort total_euros from highest to lowest
        return b.total_euros - a.total_euros
    });

    await writeCsvTask3(result)
}

//Create the csv file for Task 3
async function writeCsvTask3(result) {
    const csvWriter = createCsvWriter({
        path: 'data/customer_ranking.csv',
        header: [
            {id: 'id', title: 'PRODUCT ID'},
            {id: 'firstname', title: 'FIRSTNAME'},
            {id: 'lastname', title: 'LASTNAME'},
            {id: 'total_euros', title: 'TOTAL EUROS'}
        ]
    });

    await csvWriter.writeRecords(result)
}

task1();
task2();
task3();
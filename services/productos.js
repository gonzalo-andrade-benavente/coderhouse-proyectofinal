const { log } = require('console');
const fs = require('fs');
const products = [];

const pathFile = process.env.PATH_PRODUCTOS;

const connectDB = async () => {
    try {
        const file = await fs.promises.readFile(pathFile, 'utf-8');
        const productsFile = JSON.parse(file);
        productsFile.forEach(prd => products.push(prd));

    } catch (err) {
        console.log('[error service.connectFIle method]', err);
    }
}
const saveProduct = async (product) => {
    await connectDB();
    products.push(product);
    await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));  
    return product.id;
}

const findProductById = async (id) => {
    await connectDB();
    const product = products.find(prd => prd.id === id); //be8c11dd-3bc3-43b7-91c2-cf43a3c15757
    return product;

}

module.exports = {
    connectDB
    , findProductById
    , saveProduct
}
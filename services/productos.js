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
    //await connectDB();
    products.push(product);
    await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));  
    return product.id;
}

const findProductById = (id) => {
    const product = products.find(prd => prd.id === id && (!prd.borrado) ); //be8c11dd-3bc3-43b7-91c2-cf43a3c15757
    return product;
}

const updateProductById = async (id, prd) => {
    const indexProduct = products.findIndex(prd => prd.id === id && (!prd.borrado));
    let product;

    if (indexProduct !== -1) {
        //Actualizo el producto.
       products[indexProduct].nombre = prd.nombre !== undefined ? prd.nombre : products[indexProduct].nombre ;
       products[indexProduct].descripcion = prd.descripcion !== undefined ? prd.descripcion : products[indexProduct].descripcion ;
       products[indexProduct].codigo = prd.codigo !== undefined ? prd.codigo : products[indexProduct].codigo ;
       products[indexProduct].foto = prd.foto !== undefined ? prd.foto : products[indexProduct].foto ;
       products[indexProduct].precio = prd.precio !== undefined ? prd.precio : products[indexProduct].precio ;
       products[indexProduct].stock = prd.stock !== undefined ? prd.stock : products[indexProduct].stock ;
       product = products[indexProduct];
       await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));
    }
    return product;
}

const deleteProductById = async(id) => {
    const indexProduct = products.findIndex(prd => prd.id === id && (!prd.borrado));
    if (indexProduct !== -1) {
        products[indexProduct].borrado = true;
        await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));
    }
    return products[indexProduct];
}

module.exports = {
    connectDB
    , deleteProductById
    , findProductById
    , updateProductById
    , saveProduct
}
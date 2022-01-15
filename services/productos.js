const fs = require('fs');

const { config } = require('../config/index');
const pathFile = process.env.PATH_PRODUCTOS;
let products = [];
const { ProductosModel } = require('../models/Productos');

const instanceFirestore = require('../config/databaseFirestore');
const databaseFirestore = instanceFirestore.instance;


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

    let id;

    if (config.database === 'FILESYSTEM') {
        
        products.push(product);
        await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2)); 
        id = product.id; 
    
    } else if (config.database === 'MONGO') {

        try {
            const prd = await ProductosModel.create(product);
            id = prd._id;
        } catch (err) {
            console.log(err);
        }
    
    } else if (config.database === 'FIREBASE') {

        const productosDoc = databaseFirestore.collection('productos').doc();
        
        await productosDoc.set({
            timestamp: product.timestamp,
            nombre: product.nombre,
            descripcion: product.descripcion,
            codigo: product.codigo,
            foto: product.foto,
            precio: product.precio,
            stock: product.stock
        });

        id = productosDoc.id;

    }


   return id;
}

const findProductById = async (id) => {

    let prd, countPrd;

    if (config.database === 'FILESYSTEM') {

        if (id !== undefined ) {
            prd = products.find(prd => prd.id === id);
        } else {
            countPrd = products.length;
            prd = {
                total: countPrd,
                prd: products
            }
        }
        

    } else if (config.database === 'MONGO') {

        try {
            if (id !== undefined ) {
                prd = await ProductosModel.findById(id); 
            } else {
                //prd = await ProductosModel.find({ borrado: false });
                prd = await ProductosModel.find({});
                countPrd = await ProductosModel.countDocuments({});
                prd = {
                    total: countPrd,
                    products: prd
                }
            }
            
        } catch (err) {
           console.log(err);
        }
    } else if (config.database === 'FIREBASE') {

        try {

            if (id !== undefined) {
                console.log(id);
            } else {
                prd = await databaseFirestore.collection('productos').get();
                prd.forEach(elem => {
                    console.log(elem.data());
                });
            }


        } catch (err) {
            console.log(err);
        }

    }


    return prd;

}

const updateProductById = async (id, prd) => {
 
    let prdUpd, product, indexProduct;

    if (config.database === 'FILESYSTEM') {

        indexProduct = products.findIndex(prd => prd.id === id);

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

        prdUpd = product;

    } else if (config.database === 'MONGO') {
        try {

            prdUpd = await ProductosModel.findByIdAndUpdate(id, prd, { new: true});
    
        } catch (err) {
            console.log(err);
        }
    }

    

    return prdUpd;
}

const deleteProductById = async (id) => {
    /*
    const indexProduct = products.findIndex(prd => prd.id === id && (!prd.borrado));
    if (indexProduct !== -1) {
        products[indexProduct].borrado = true;
        await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));
    }
    return products[indexProduct];
    */
    let prd, indexProduct, productsAux;

    if (config.database === 'FILESYSTEM') {
        
        indexProduct = products.findIndex(prd => prd.id === id );

        if (indexProduct !== -1) {
            prd = products[indexProduct]; 
            //products[indexProduct].borrado = true;
            products = products.filter(prd => prd.id !== id );
            
            await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));
        }

    } else if (config.database === 'MONGO') {
        try {
            prd = await ProductosModel.findByIdAndDelete(id);
        } catch (err) {
            console.log(err);
        }
    }

   return prd;
}

module.exports = {
    connectDB
    , deleteProductById
    , findProductById
    , updateProductById
    , saveProduct
}
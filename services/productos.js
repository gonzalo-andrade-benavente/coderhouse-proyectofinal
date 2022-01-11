const fs = require('fs');
const products = [];

const pathFile = process.env.PATH_PRODUCTOS;

const { ProductosModel } = require('../models/Productos');

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
    
    /*
    products.push(product);
    await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));  
    return product.id;
    */
   let id;
   try {
        const prd = await ProductosModel.create(product);
        id = prd._id;
   } catch (err) {
        console.log(err);
   }

   return id;
}

const findProductById = async (id) => {
    /*
    const product = products.find(prd => prd.id === id && (!prd.borrado) ); //be8c11dd-3bc3-43b7-91c2-cf43a3c15757
    return product;
    */
    let prd, countPrd;
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

    return prd;

}

const updateProductById = async (id, prd) => {
    /*
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
    */
    let prdUpd;

    try {

        prdUpd = await ProductosModel.findByIdAndUpdate(id, prd, { new: true});

    } catch (err) {
        console.log(err);
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
   let prd;

   try {
        prd = await ProductosModel.findByIdAndDelete(id);
   } catch (err) {
       console.log(err);
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
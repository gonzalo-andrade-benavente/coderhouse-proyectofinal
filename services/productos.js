const fs = require('fs');

const { config } = require('../config/index');
const pathFile = process.env.PATH_PRODUCTOS;
let products = [];
const { ProductosModel } = require('../models/Productos');

const instanceFirestore = require('../config/databaseFirestore');
const { productosSchema } = require('../models/schemas/productos');
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
    let productosAux = [];

    if (config.database === 'FILESYSTEM') {

        if (id !== undefined ) {
            prd = products.find(prd => prd.id === id);
        } else {
            countPrd = products.length;
            prd = {
                total: countPrd,
                productos: products
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
                    productos: prd
                }
            }
            
        } catch (err) {
           console.log(err);
        }
    } else if (config.database === 'FIREBASE') {

        try {

            if (id !== undefined) {
                
                try {
                    prd = await databaseFirestore.collection('productos').doc(id).get();
                    newPrd = prd.data();
                    newPrd.id = prd.id;
    
                    prd = newPrd;
                } catch(err) {
                    prd = null;
                }
            
            } else {
                prd = await databaseFirestore.collection('productos').get();
                countPrd = 0;
                prd.forEach(elem => {
                    newPrd = elem.data();
                    newPrd.id = elem.id;
                    productosAux = [...productosAux, newPrd];
                    countPrd++;
                });

                prd = {
                    total: countPrd,
                    productos: productosAux
                }
                
            }


        } catch (err) {
            console.log(err);
        }

    }


    return prd;

}

const updateProductById = async (id, prd) => {
 
    let prdUpd, product, indexProduct, prdAux;

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
    } else if (config.database === 'FIREBASE') {

        try {
            prdUpd = await databaseFirestore.collection('productos').doc(id);

            prdAux = await prdUpd.get();

            await prdUpd.update({
                nombre: prd.nombre !== undefined ? prd.nombre : prdAux.data().nombre,
                descripcion: prd.descripcion !== undefined ? prd.descripcion : prdAux.data().descripcion,
                codigo: prd.codigo !== undefined ? prd.codigo : prdAux.data().codigo,
                foto: prd.foto !== undefined ? prd.foto : prdAux.data().foto,
                precio: prd.precio !== undefined ? prd.precio : prdAux.data().precio,
                stock: prd.stock !== undefined ? prd.stock : prdAux.data().stock
            });

            prdUpd = await databaseFirestore.collection('productos').doc(id).get();

            prdAux = prdUpd.data();
            prdAux.id = prdUpd.id;
            prdUpd = prdAux;


        } catch(err) {
            console.log(err);
        }     

    }

    return prdUpd;
}

const deleteProductById = async (id) => {

    let prd, indexProduct;

    if (config.database === 'FILESYSTEM') {
        
        indexProduct = products.findIndex(prd => prd.id === id );

        if (indexProduct !== -1) {
            //products[indexProduct].borrado = true;
            products = products.filter(prd => prd.id !== id );        
            await fs.promises.writeFile(pathFile, JSON.stringify(products, null, 2));
        } else {
            prd =  null;
        }

    } else if (config.database === 'MONGO') {
        try {
            await ProductosModel.findByIdAndDelete(id);
        } catch (err) {
            console.log(err);
            prd =  null;
        }
    } else if (config.database === 'FIREBASE') { 

        try {
            prd = await databaseFirestore.collection('productos').doc(id);
            
            if (prd.id !== undefined) {
                await databaseFirestore.collection('productos').doc(id).delete();    
            } else {
                prd = null;
            }

        } catch(err) {
            console.log(err);
            prd =  null;
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
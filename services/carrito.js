const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const carritos = [];
const { CarritoModel } = require('../models/Carrito');
const { config } = require('../config/index');

const COLLECTION = 'carritos';
const instanceFirestore = require('../config/databaseFirestore');
const databaseFirestore = instanceFirestore.instance;

const { findProductById } = require('../services/productos');
const pathFile = process.env.PATH_CARRITO;

const connectDBCart = async () => {
    try {
        const file = await fs.promises.readFile(pathFile, 'utf-8');
        const cartFile = JSON.parse(file);
        cartFile.forEach(cart => carritos.push(cart));

    } catch (err) {
        console.log('[error service.connectFIle method]', err);
    }
}

const createEmptyCart = async () => {

    let cart;

    if (config.database === 'FILESYSTEM') {

        cart = {
            id: uuidv4(), 
            timestamp: Date.now(),
            productos: []
        };

        carritos.push(cart);
        await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  

    } else if (config.database === 'MONGO') {

        try {
            cart = await CarritoModel.create({
                timestamp: Date.now()
            });
        } catch (err) {
            console.log(err);
        }

    } else if (config.database === 'FIREBASE') { 
     
        try {

            const carritoDoc = databaseFirestore.collection(COLLECTION).doc();
            
            cart = {
                timestamp: Date.now(),
                products: []
            }

            await carritoDoc.set(cart);

            cart.id = carritoDoc.id

        } catch (err) {
            console.log(err);
        }
        

    }

    return cart;

}

const addProductCart = async (id, id_prod) => {

    let cart, prd, indexCart, productosAux, timestamp;
    
    if (config.database === 'FILESYSTEM') {

        indexCart = carritos.findIndex(cart => cart.id === id);
        
        if (indexCart > -1) {
            const producto = await findProductById(id_prod);
            carritos[indexCart].productos.push(producto);
            cart = carritos[indexCart];
            await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
        }


    } else if (config.database === 'MONGO') {
        try {

            cart = await CarritoModel.findById(id);
    
            if (cart !== null) {
                prd = await findProductById(id_prod);
                if (prd !== undefined) {
                    // Controlar si el producto existe o no.
                    cart = await CarritoModel.findById(id);
                    cart.productos = [...cart.productos, prd];
                    //cart.productos.push(prd);
                    await cart.save();
                } else {
                    cart = undefined;
                }
            }
                
    
        } catch(err) {
            console.log(err);
        }
    } else if (config.database === 'FIREBASE') { 

        try {

            cart = await databaseFirestore.collection(COLLECTION).doc(id).get();

            if (cart.data() !== undefined) {

                prd = await findProductById(id_prod);
                
                if (prd !== null) {
                    productosAux  = cart.data().productos;
                    timestamp = cart.data().timestamp;

                    if (productosAux === undefined) {
                        productosAux = [];
                        productosAux.push(prd);
                    } else {
                        productosAux.push(prd);
                    }

                    await databaseFirestore.collection(COLLECTION)
                                            .doc(id)
                                            .set({
                                                productos: productosAux,
                                                timestamp
                                            });

                    cart = cart.data();
                    cart.id = id;
                } else {
                    cart = undefined;
                }

            } else {
                cart = undefined;
            }

        } catch(err) {
            console.log(err);
            cart = undefined;
        }
        

    }

   
    return cart;

}

const getProductsById = async (id) => {
    
    let cart;

    if (config.database === 'FILESYSTEM') {

        cart = carritos.find( cart => cart.id === id);


    } else if (config.database === 'MONGO') {
        
        try {
            cart = await CarritoModel.findById(id);
        } catch(err) {
            console.log(err);
        }
    
    } else if (config.database === 'FIREBASE') { 
        try {
            cart = await databaseFirestore.collection(COLLECTION).doc(id).get();

            if (cart.data() !== undefined) { 
                cart = cart.data();
            } else {
                cart = undefined;
            }

        } catch(err) {
            console.log(err);
        }
    }

    if ( ( cart === undefined) || (cart === null) ) {
        cart = {
            productos: undefined,
        }
    }

    return cart.productos;
}

const deleteCartById = async (id) => {
    
    let indexCart = -1;

    if (config.database === 'FILESYSTEM') {

        if (carritos.length > 0) {
            indexCart = carritos.findIndex(cart => cart.id === id);
        }
    
        if (indexCart > -1) {
            carritos[indexCart].id = '-1';
            await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2));  
        }

    } else if (config.database === 'MONGO') {
        try {
            await CarritoModel.findByIdAndDelete(id);
            indexCart = 1;
        } catch (err) {
            console.log(err);
        }
    } else if (config.database === 'FIREBASE') { 
        let cart;

        try {
            cart = await databaseFirestore.collection(COLLECTION).doc(id);
            if (cart.id !== undefined) {
                databaseFirestore.collection(COLLECTION).doc(id).delete(); 
                indexCart = 1;
            } else {
                indexCart = -1;
            }
        }catch(err) {
            console.log(err);
            indexCart = -1;
        }
    }

    return indexCart;
}

const deleteCartProductById = async (id, id_prod) => {
    
    let indexCart = -1;

    let product, products;

    product = {
        id_prod,
        borrado: false
    }

    if (config.database === 'FILESYSTEM') {

    
        if (carritos.length > 0) {
            indexCart = carritos.findIndex(cart => cart.id === id);
        }
    
        if (indexCart > -1) {
            const tmpProducts = carritos[indexCart].productos.filter(prd => prd.id !== id_prod);
            carritos[indexCart].productos = tmpProducts;
            product.borrado = true;
            await fs.promises.writeFile(pathFile, JSON.stringify(carritos, null, 2)); 
        }

    } else if (config.database === 'MONGO') {
        
        try {
            cart = await CarritoModel.findById(id);
            products = cart.productos.filter(prd => prd._id.toString() !== id_prod);
            cart.productos = products;
            await cart.save();
            product.borrado = true;

        } catch(err) {
            console.log(err);
        }

    } else if (config.database === 'FIREBASE') { 
        
        try {

            cart = await databaseFirestore.collection(COLLECTION).doc(id).get();

            if (cart.data() !== undefined) {

                prd = await findProductById(id_prod);

                if (prd !== null) {
                    productosAux  = cart.data().productos;
                    timestamp = cart.data().timestamp;

                    if (productosAux === undefined) {
                        cart = undefined;
                    } else {
                        productosAux = productosAux.filter(prd => prd.id !== id_prod);
                    }

                    await databaseFirestore.collection(COLLECTION)
                                            .doc(id)
                                            .set({
                                                productos: productosAux,
                                                timestamp
                                            });

                    product = prd;
                } else {
                    cart = undefined;
                }

            } else {
                cart = undefined;
            }

        } catch(err) {
            console.log(err);
            cart = undefined;
        }
        
    }


    return product;
}

module.exports = {
    addProductCart
    , connectDBCart
    , createEmptyCart
    , getProductsById
    , deleteCartById
    , deleteCartProductById
}
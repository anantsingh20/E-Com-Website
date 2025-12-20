import { getCartProductFromLS } from "./getCartProducts";
import { updateCartValue } from "./updateCartValue";

getCartProductFromLS();

export const addToCart = (event, id, stock) =>{
    
    let arrLocalStorageProduct = getCartProductFromLS();
    
    
    const currentProdElem = document.querySelector(`#card${id}`);
    console.log(currentProdElem);
    let quantity = currentProdElem.querySelector(".productQuantity").innerText;
    let price = currentProdElem.querySelector(".productPrice").innerText;

    price = price.replace("₹", "");

    let existingProd =  arrLocalStorageProduct.find((currProd) => currProd.id === id );

    if(existingProd && quantity > 1) {
        quantity = Number( existingProd.quantity) + Number(quantity);
        price = Number( price * quantity);
        let updatedCart = { id, quantity, price};
        
        updatedCart = arrLocalStorageProduct.map((currProd) => {
            return currProd.id === id ? updatedCart : currProd;
        });
        console.log(updatedCart);
        localStorage.setItem('cartProductLS', JSON.stringify(arrLocalStorageProduct));
    }

    if (existingProd) {

        return false;
    }
        


    price = Number( price * quantity);
    quantity = Number(quantity);

    //let updateCart = { id, quantity, price };
    arrLocalStorageProduct.push({id, quantity, price});
    localStorage.setItem('cartProductLS', JSON.stringify(arrLocalStorageProduct));

    updateCartValue(arrLocalStorageProduct);
};
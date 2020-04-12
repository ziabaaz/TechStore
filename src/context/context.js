import React, { Component } from "react";
import { linkData } from "./linkData";
import { socialData } from "./socialData";
import { items } from "./productData";
import { client } from "./contentful";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    sidebarOpen: false,
    cartOpen: false,
    cartItems: 0,
    links: linkData,
    socialIcons: socialData,
    cart: [],
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
    storeProducts: [],
    featuredProducts: [],
    filteredProducts: [],
    singleProduct: {},
    loading: true,
    search: "",
    price: 0,
    max: 0,
    min: 0,
    company: "all",
    shipping: false,
  };

  componentDidMount() {
    //this.setProducts(items);
    client
    .getEntries({
      content_type: "techStore"
    })
    .then(response => this.setProducts(response.items))
    .catch(console.error);


  }

  //this is to format id and fields into a proper json.
  setProducts = (products) => {
    let storeProducts = products.map((item) => {
      const { id } = item.sys;
      const image = item.fields.image.fields.file.url;
      const product = { id, ...item.fields, image };
      return product;
    });

    let featuredProducts = storeProducts.filter(
      (item) => item.featured === true
    );

    let maxPrice = Math.max(...storeProducts.map((item) => item.price));

    this.setState(
      {
        storeProducts,
        filteredProducts: storeProducts,
        featuredProducts,
        loading: false,
        cart: this.getStorageCart(),
        singleProduct: this.getStorageProduct(),
        price: maxPrice,
        max: maxPrice,
      },
      () => {
        this.addTotals();
      }
    );
  };

  getStorageCart = () => {
    let cart;
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    } else {
      cart = [];
    }
    return cart;
  };

  getStorageProduct = () => {
    return localStorage.getItem("singleProduct")
      ? JSON.parse(localStorage.getItem("singleProduct"))
      : {};
  };

  getTotals = () => {
    let subTotal = 0;
    let cartItems = 0;
    this.state.cart.forEach((item) => {
      subTotal += item.total;
      cartItems += item.count;
    });
    subTotal = parseFloat(subTotal.toFixed(2));
    let tax = subTotal * 0.2;
    tax = parseFloat(tax.toFixed(2));

    let total = subTotal + tax;
    total = parseFloat(total.toFixed(2));

    return { subTotal, cartItems, tax, total };
  };

  addTotals = () => {
    const totals = this.getTotals();
    this.setState({
      cartItems: totals.cartItems,
      cartSubTotal: totals.subTotal,
      cartTax: totals.tax,
      cartTotal: totals.total,
    });
  };

  syncStorage = () => {
    localStorage.setItem("cart", JSON.stringify(this.state.cart));
  };

  setSingleProduct = (id) => {
    let product = this.state.storeProducts.find((item) => item.id === id);
    localStorage.setItem("singleProduct", JSON.stringify(product));
    this.setState({
      singleProduct: { ...product },
      loading: false,
    });
  };

  addToCart = (id) => {
    let tempCart = [...this.state.cart];
    let tempProducts = this.state.storeProducts;
    let tempItem = tempCart.find((item) => item.id === id);

    if (!tempItem) {
      tempItem = tempProducts.find((item) => item.id === id);
      let total = tempItem.price;
      let cartItem = { ...tempItem, count: 1, total };
      tempCart = [...tempCart, cartItem];
    } else {
      tempItem.count++;
      tempItem.total = tempItem.price * tempItem.count;
      tempItem.total = parseFloat(tempItem.total.toFixed(2));
    }

    this.setState(
      () => {
        return { cart: tempCart };
      },
      () => {
        this.addTotals();
        this.syncStorage();
        this.openCart();
      }
    );
  };

  handleSidebar = () => {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen,
    });
  };

  handleCart = () => {
    this.setState({
      cartOpen: !this.state.cartOpen,
    });
  };

  closeCart = () => {
    this.setState({
      cartOpen: false,
    });
  };

  openCart = () => {
    this.setState({
      cartOpen: true,
    });
  };

  //cart functionality

  increment = (id) => {
    let tempCart = [...this.state.cart];

    //increasing the count and price for existing cart item

    const cartItem = tempCart.find((item) => item.id === id);
    cartItem.count++;
    cartItem.total = cartItem.count * cartItem.price;
    cartItem.total = parseFloat(cartItem.total.toFixed(2));

    this.setState(
      () => {
        return {
          cart: [...tempCart],
        };
      },
      () => {
        this.addTotals();
        this.syncStorage();
      }
    );
  };

  decrement = (id) => {
    let tempCart = [...this.state.cart];
    const cartItem = tempCart.find((item) => item.id === id);
    cartItem.count = cartItem.count - 1;

    if (cartItem.count === 0) {
      this.removeItem(id);
    } else {
      cartItem.total = cartItem.count * cartItem.price;
      cartItem.total = parseFloat(cartItem.total.toFixed(2));

      this.setState(
        {
          cart: [...tempCart],
        },
        () => {
          this.addTotals();
          this.syncStorage();
        }
      );
    }
  };

  removeItem = (id) => {
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter((item) => item.id !== id);

    this.setState(
      () => {
        return {
          cart: [...tempCart],
        };
      },
      () => {
        this.addTotals();
        this.syncStorage();
      }
    );
  };

  clearCart = () => {
    this.setState(
      {
        cart: [],
      },
      () => {
        this.addTotals();
        this.syncStorage();
      }
    );
  };

  //handle filtering
  handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    this.setState(
      {
        [name]: value,
      },  
        this.sortData
    );
  };

  sortData = () => {
    const {storeProducts, price, company, shipping, search} = this.state;
    
    let tempPrice= parseInt(price);

    let tempProducts = [...storeProducts];

    //filter by price

    tempProducts = tempProducts.filter(item=> item.price <= tempPrice);

    //filter by company
    if(company !== "all")
    {
      tempProducts = tempProducts.filter(item=> item.company === company);
    }

    //filter by shipping

    if(shipping)
    {
      tempProducts = tempProducts.filter(item=> item.freeShipping === true);
    }

    if(search.length > 0)
    {
      tempProducts = tempProducts.filter(item=> {
        let tempSearch = search.toLowerCase();
        let tempTitle= item.title.toLowerCase().slice(0, search.length);
        if(tempSearch===tempTitle)
        {
          return item;
        }
      })
    }

    this.setState({
      filteredProducts: tempProducts
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleSidebar: this.handleSidebar,
          handleCart: this.handleCart,
          closeCart: this.closeCart,
          openCart: this.openCart,
          addToCart: this.addToCart,
          setSingleProduct: this.setSingleProduct,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          handleChange: this.handleChange,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductContext, ProductProvider, ProductConsumer };

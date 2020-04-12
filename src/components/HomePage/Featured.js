import React from "react";
import Product from "../Product";
import Title from "../Title";
import { ProductConsumer } from "../../context/context";

export default function Featured() {
  return (
    <section className="py-5">
      <div className="container">
        <Title title="featured products" center="true"></Title>
        <div className="row">
          <ProductConsumer>
            {value => {
              const { featuredProducts } = value;
              return featuredProducts.map(product => (
                <Product key={product.id} product={product}></Product>
              ));
            }}
          </ProductConsumer>
        </div>
      </div>
    </section>
  );
}

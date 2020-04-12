import React from "react";
import porductsBcg from "../images/productsBcg.jpeg";
import Hero from "../components/Hero";
import Products from "../components/ProductsPage/Products";

export default function ProductsPage() {
  return (
    <Hero img={porductsBcg}>
      <Products></Products>
    </Hero>
  );
}

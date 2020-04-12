import React from "react";
import Contact from "../components/ContactPage/Contact";
import contactImg from "../images/contactBcg.jpeg";
import Hero from "../components/Hero";

export default function ContactPage() {
  return (
    <>
      <Hero img={contactImg}></Hero>
      <Contact />
    </>
  );
}

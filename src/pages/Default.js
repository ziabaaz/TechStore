import React from "react";
import Hero from "../components/Hero";
import defaultBcgImage from "../images/defaultBcg.jpeg";
import { Link } from "react-router-dom";

export default function Default() {
  return (
    <Hero img={defaultBcgImage} title="404" max="true">
      <h2 className="text-uppercase">page not found</h2>
      <Link to="/" className="main-link" style={{ margin: "" }}>
        return home
      </Link>
    </Hero>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <h2 className="error-message">page not found</h2>
      <p className="error-para">
        Sorry, the page you're looking for does not exist.
      </p>
      <Link to="/" className="home-btn">
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;

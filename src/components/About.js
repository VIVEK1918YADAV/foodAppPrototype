import React, { useState } from "react";
import Healthy_Food from "../Images/healthy_food3.png";
import Dinning from "../Images/restaurent_dine.jpg";
import { MdChevronRight } from "react-icons/md";
import MessageModal from "./MessageModal";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase.config";
import { useSelector } from "react-redux";

const About = ({ closeMenu }) => {
  const { isMenuOpen } = useSelector((state) => state.userData);
  const [user] = useAuthState(firebaseAuth);

  const [isUser, setIsUser] = useState(false);
  const [modalTimeout, setModalTimeout] = useState(null);
  const modalDuration = 3000;

  const displayMessageModal = () => {
    clearTimeout(modalTimeout);
    setIsUser(false);
    setTimeout(() => {
      setIsUser(true);
    }, 0);

    const transitionDuration = 200;
    setModalTimeout(
      setTimeout(() => {
        setIsUser(false);
      }, modalDuration + transitionDuration)
    );
  };

  return (
    <section
      className="about-section"
      id="about"
      onClick={() => {
        if (user && isMenuOpen) {
          closeMenu();
        }
      }}
    >
      <div className="about-header">
        <h1 className="about-heading">About Us</h1>
        <div className="moto-container">
          <h2>Our Moto</h2>
          <div className="healthy-img">
            <img src={Healthy_Food} alt="" />
          </div>
          <div className="about-moto">
            <h2>Our Moto</h2>
            <p>
              Welcome to HunGreed Inc. where we believe that every person should
              go to bed on a full stomach and a big smile on their faces.
              Healthy appetite, proper nutrition and a tasty meal is the key to
              healthy mind and disease-free body. And so, we deliver your food
              healthy, tasty and while its still HOT.
            </p>
          </div>
        </div>
      </div>
      <div className="about-main">
        <div className="aboutUs-container">
          <h2>Who are we ?</h2>
          <div className="dine-img">
            <img src={Dinning} alt="" />
          </div>
          <div className="about-us">
            <h2>Who are we ?</h2>
            <p>
              Launched in 2010, We serve as a global food chain with an ever
              evolving taste to satisfy our customers. Also our technology
              platform connects customers with our restaurant. Customers can
              enjoy their favourite HunGreed taste in almost over 75+ countries
              and can either visit our restaurents to dine or use our platform
              to order food from our restaurants online and enjoy their
              favourite food anywhere. They can read and write food reviews and
              view and upload photos, book a table and make payments while
              dining-out at our restaurants. We provide our customers reliable
              and efficient last mile delivery service. We supply high quality
              ingredients and kitchen products to our restaurants to ensure
              healthy meals to our customers. Also we regularly launch new
              dishes to provide our customers with more variety to choose from.
              Our isolated multy-kitchen and staff arrangement provides our
              vegiterian customers with pure vegeterian dishes untouched with
              the non-vegeterian dishes that we serve.
            </p>
          </div>
        </div>
      </div>
      <div className="join-btn-container">
        {user ? (
          <button className="join-btn" onClick={displayMessageModal}>
            Join Us <MdChevronRight className="right-icon" />
          </button>
        ) : (
          <Link to="/sign-in" className="join-btn">
            Join Us <MdChevronRight className="right-icon" />
          </Link>
        )}
      </div>
      {isUser && (
        <MessageModal
          modalDuration={modalDuration}
          type={"success"}
          message={"Already logged in !!"}
          page={"about"}
        />
      )}
    </section>
  );
};

export default About;

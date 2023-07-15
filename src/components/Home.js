import React, { useEffect, useState } from "react";
import Header from "./Header";
import CartContainer from "./CartContainer";
import HeroSection from "./HeroSection";
import About from "./About";
import MenuSection from "./MenuSection";
import ServicesSection from "./ServicesSection";
import PremiumContainer from "./PremiumContainer";
import OrderSuccessMessageModal from "./OrderSuccessMessageModal";
import Footer from "./Footer";
import { setIsMenuOpen } from "../reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCartIsOpen, setUserInfo } from "../reducers/userSlice";
import MessageModal from "./MessageModal";
import { fetchUserData } from "../utils/firebaseFunctions";

const Home = () => {
  const { userInfo, cart } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const modalDuration = 3000;
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isOrderSuccessModal, setIsOrderSuccessModal] = useState(false);
  const [offset, setOffset] = useState(-82);

  const fetchUserDetails = async (uid) => {
    const data = await fetchUserData(uid);
    dispatch(setUserInfo(data));
  };

  const closeCart = () => {
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.classList.remove("open-cart");
    document.getElementById("background-overlay").style.backgroundColor =
      "rgba(0, 0, 0, 0)";

    const transitionDuration =
      parseFloat(
        window
          .getComputedStyle(cartContainer)
          .getPropertyValue("transition-duration")
      ) * 1000;
    setTimeout(() => {
      dispatch(setCartIsOpen(false));
      document.getElementById("background-overlay").style.display = "none";
    }, transitionDuration);
  };

  const closeMenu = () => {
    const userDropdown = document.querySelector(".user-dropdown-menu");
    userDropdown.classList.remove("openMenu");

    const transitionDuration =
      parseFloat(
        window
          .getComputedStyle(userDropdown)
          .getPropertyValue("transition-duration")
      ) * 1000;
    setTimeout(() => {
      userDropdown.style.display = "none"; //for closing animation

      dispatch(setIsMenuOpen(false));
    }, transitionDuration);
  };

  function getNavHeight() {
    const nav = document.querySelector(".navbar");
    const navHeight = parseFloat(getComputedStyle(nav).height);
    setOffset(-navHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", getNavHeight);
    getNavHeight();
    return () => window.removeEventListener("resize", getNavHeight);
  }, []);

  return (
    <>
      <div
        id="background-overlay"
        onClick={() => {
          if (cart.isOpen) closeCart();
        }}
      ></div>
      <Header offset={offset} />
      <CartContainer setIsOrderSuccessModal={setIsOrderSuccessModal} />
      <HeroSection closeMenu={closeMenu} offset={offset} />
      <MenuSection closeMenu={closeMenu} />
      <About closeMenu={closeMenu} />
      <ServicesSection closeMenu={closeMenu} />
      {userInfo?.accountType === "local" && !joinSuccess && (
        <PremiumContainer
          setJoinSuccess={setJoinSuccess}
          fetchUserDetails={fetchUserDetails}
          closeMenu={closeMenu}
        />
      )}

      {/* premium member modal */}
      {joinSuccess && (
        <MessageModal
          modalDuration={modalDuration}
          type={"success"}
          message={"Congratulations!! You are now a premium member."}
          page={"premium"}
        />
      )}

      {/* order successful modal */}
      {isOrderSuccessModal && (
        <OrderSuccessMessageModal
          setIsOrderSuccessModal={setIsOrderSuccessModal}
        />
      )}
      <Footer closeMenu={closeMenu} />
    </>
  );
};

export default Home;

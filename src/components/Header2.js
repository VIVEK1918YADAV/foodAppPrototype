import React, { useEffect, useRef } from "react";
import {
  MdShoppingBasket,
  MdOutlineLogout,
  MdOutlineAccountBalanceWallet,
  MdOutlineDashboard,
  MdAdd,
  MdOutlineHome,
} from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { Link as LinkR } from "react-router-dom";
import Avatar from "../Images/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartIsOpen,
  setIsMenuOpen,
  setUserInfo,
} from "../reducers/userSlice";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../firebase.config";
import { useCallback } from "react";

const Header = () => {
  const {
    userInfo,
    isMenuOpen,
    cart: { isOpen, cartItems },
  } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const userDropdownRef = useRef();
  const cartItemCountRef = useRef();

  const openMenu = () => {
    userDropdownRef.current.style.display = "flex";
    setTimeout(() => {
      dispatch(setIsMenuOpen(true));
    }, 0);
  };

  const closeMenu = (e) => {
    if (!(e && e.target.classList.contains("ignoreCloseMenu"))) {
      if (
        e &&
        e.target.parentNode.tagName === "svg" &&
        e.target.parentNode.classList.contains("ignoreCloseMenu")
      ) {
        return;
      }

      userDropdownRef.current.classList.remove("openMenu");
      const transitionDuration =
        parseFloat(
          window
            .getComputedStyle(userDropdownRef.current)
            .getPropertyValue("transition-duration")
        ) * 1000;
      setTimeout(() => {
        userDropdownRef.current.style.display = "none"; //for closing animation

        dispatch(setIsMenuOpen(false));
      }, transitionDuration);
    }
  };

  const logout = () => {
    dispatch(setIsMenuOpen(false));
    window.location.href = "/";
    dispatch(setUserInfo(null));
    signOut(firebaseAuth);
  };

  const openCart = () => {
    dispatch(setCartIsOpen(!isOpen));
    document.getElementById("background-overlay").style.display = "block";
    setTimeout(() => {
      document.getElementById("background-overlay").style.backgroundColor =
        "rgba(0, 0, 0, 0.6)";
    }, 0);
  };

  const totalQty = useCallback(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += item.qty;
    });
    cartItemCountRef.current.innerText = sum;
  }, [cartItems]);

  const setAltUserImg = (e) => {
    e.onError = null; // to avoid infinite loop in case of faulty backup image
    e.target.src = Avatar;
  };

  useEffect(() => {
    if (cartItemCountRef.current) {
      totalQty();
    }
  }, [totalQty]);

  return (
    <nav
      className="navbar"
      onClick={(e) => {
        if (isMenuOpen) {
          closeMenu(e);
        }
      }}
    >
      <div className="nav-container">
        <div className="brand-logo">
          <LinkR
            to="/"
            className="logo-text ignoreCloseMenu"
            onClick={() => dispatch(setIsMenuOpen(false))}
          >
            <span className="ignoreCloseMenu">H</span>
            <span className="small ignoreCloseMenu">un</span>
            <span className="ignoreCloseMenu">G</span>
            <span className="small ignoreCloseMenu">reed</span>
          </LinkR>
        </div>
        <div className="cartIcon-container2">
          <button className="cart" onClick={openCart}>
            <MdShoppingBasket />
            {cartItems && cartItems.length > 0 && (
              <div className="cart-itemCount">
                <p ref={cartItemCountRef}></p>
              </div>
            )}
          </button>
        </div>
        <div className="user-profile">
          <button className="user-profile-btn">
            <img
              src={userInfo?.image || Avatar}
              alt="user-profile"
              onError={(e) => setAltUserImg(e)}
              onClick={() => (isMenuOpen ? closeMenu() : openMenu())}
            />
          </button>
          <div
            ref={userDropdownRef}
            className={`user-dropdown-menu ignoreCloseMenu ${
              isMenuOpen && "openMenu"
            }`}
          >
            <p className="user-name ignoreCloseMenu">
              {userInfo?.name?.split(" ").slice(0, 2).join(" ")}
              {userInfo?.accountType !== "local" && (
                <span className="ignoreCloseMenu">{userInfo?.accountType}</span>
              )}
            </p>
            {userInfo && (
              <p className="wallet ignoreCloseMenu">
                <span className="ignoreCloseMenu">
                  <MdOutlineAccountBalanceWallet className="yellow ignoreCloseMenu" />{" "}
                  Wallet
                </span>{" "}
                <span className="ignoreCloseMenu">
                  <BiRupee className="green ignoreCloseMenu" />
                  {userInfo?.wallet}
                </span>
              </p>
            )}
            <hr />
            <LinkR
              to="/"
              className="ignoreCloseMenu"
              onClick={() => dispatch(setIsMenuOpen(false))}
            >
              <MdOutlineHome />
              Home
            </LinkR>
            <LinkR to="/admin/dashboard">
              <MdOutlineDashboard />
              Dashboard
            </LinkR>
            <LinkR to="/admin/create-item">
              <MdAdd />
              New Item
            </LinkR>
            <button
              className="logout-btn ignoreCloseMenu"
              onClick={() => {
                logout();
                dispatch(setIsMenuOpen(false));
              }}
            >
              <MdOutlineLogout />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

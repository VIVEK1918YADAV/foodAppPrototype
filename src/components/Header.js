import React, { useState, useEffect, useRef } from "react";
import {
  MdShoppingBasket,
  MdAdd,
  MdLogin,
  MdOutlineAccountBalanceWallet,
  MdOutlineLogout,
  MdOutlineDashboard,
} from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { Link as LinkR } from "react-router-dom";
import Avatar from "../Images/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfo,
  setIsMenuOpen,
  setCartIsOpen,
} from "../reducers/userSlice";
import { Link as LinkS, animateScroll as scroll } from "react-scroll";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase.config";
import { signOut } from "firebase/auth";
import { useCallback } from "react";

const Header = ({ offset }) => {
  const {
    userInfo,
    isMenuOpen,
    cart: { isOpen, cartItems },
  } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const [user] = useAuthState(firebaseAuth);

  const userDropdownRef = useRef();
  const cartItemCountRef = useRef();
  const cartIconContainerRef = useRef();
  const loginBtnRef = useRef();
  const [loginBtnText, setLoginBtnText] = useState(true);

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

  const changeHeaderAttrs = () => {
    const pageWidth = window.innerWidth;
    if (pageWidth > 320) {
      setLoginBtnText(true);
    } else {
      setLoginBtnText(false);
    }

    setTimeout(() => {
      const loginBtnWidth = parseInt(
        window.getComputedStyle(loginBtnRef.current).width
      );

      if (pageWidth > 640) {
        cartIconContainerRef.current.style.width = "fit-content";
      } else if (pageWidth <= 640) {
        cartIconContainerRef.current.style.width = `${loginBtnWidth}px`;
      }
    }, 0);
  };

  const toggleHome = () => {
    scroll.scrollToTop({ smooth: true, duration: 500 });
  };

  const setAltUserImg = (e) => {
    e.onError = null; // to avoid infinite loop in case of faulty backup image
    e.target.src = Avatar;
  };

  useEffect(() => {
    if (cartItemCountRef.current) {
      totalQty();
    }
  }, [totalQty]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (loginBtnRef.current) {
        changeHeaderAttrs();
      }
    });
    return () => {
      window.removeEventListener("resize", () => {
        if (loginBtnRef.current) {
          changeHeaderAttrs();
        }
      });
    };
  }, []);

  // at logout when screen is small
  useEffect(() => {
    if (loginBtnRef.current) {
      changeHeaderAttrs();
    }
  }, [loginBtnRef.current]);

  useEffect(() => {
    if (user) {
      // to set cart icon to its original size
      cartIconContainerRef.current.style.width = "fit-content";
    }
  });

  return (
    <nav
      className="navbar"
      onClick={(e) => {
        if (user && isMenuOpen) {
          closeMenu(e);
        }
      }}
    >
      <div className="nav-container">
        <div className="brand-logo">
          <LinkR to="/" className="logo-text" onClick={toggleHome}>
            <span>H</span>
            <span className="small">un</span>
            <span>G</span>
            <span className="small">reed</span>
          </LinkR>
        </div>
        <ul
          className="navlinks-container"
          onClick={() => {
            if (user) {
              closeMenu();
            }
          }}
        >
          <li className="navlinks">
            <LinkS
              to="home"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={offset}
              duration={500}
              onClick={() => {
                if (user) {
                  closeMenu();
                }
              }}
            >
              home
            </LinkS>
          </li>
          <li className="navlinks">
            <LinkS
              to="menu"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={offset}
              duration={500}
              onClick={() => {
                if (user) {
                  closeMenu();
                }
              }}
            >
              menu
            </LinkS>
          </li>
          <li className="navlinks">
            <LinkS
              to="about"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={offset}
              duration={500}
              onClick={() => {
                if (user) {
                  closeMenu();
                }
              }}
            >
              about us
            </LinkS>
          </li>
          <li className="navlinks">
            <LinkS
              to="services"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={offset}
              duration={500}
              onClick={() => {
                if (user) {
                  closeMenu();
                }
              }}
            >
              services
            </LinkS>
          </li>
        </ul>
        <div className="cartIcon-container" ref={cartIconContainerRef}>
          <button className="cart" onClick={openCart}>
            <MdShoppingBasket />
            {cartItems && cartItems.length > 0 && (
              <div className="cart-itemCount">
                <p ref={cartItemCountRef}></p>
              </div>
            )}
          </button>
        </div>
        {user ? (
          <div className="user-profile">
            <button className="user-profile-btn">
              <img
                src={user.photoURL || Avatar}
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
                  <span className="ignoreCloseMenu">
                    {userInfo?.accountType}
                  </span>
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
              {/* admin only */}
              {userInfo && userInfo.accountType === "admin" && (
                <>
                  <LinkR
                    to="/admin/dashboard"
                    className="ignoreCloseMenu"
                    onClick={() => dispatch(setIsMenuOpen(false))}
                  >
                    <MdOutlineDashboard className="ignoreCloseMenu" />
                    Dashboard
                  </LinkR>
                  <LinkR
                    to="/admin/create-item"
                    className="ignoreCloseMenu"
                    onClick={() => dispatch(setIsMenuOpen(false))}
                  >
                    <MdAdd className="ignoreCloseMenu" />
                    New Item
                  </LinkR>
                </>
              )}
              <ul className="mobile-view-list">
                <li>
                  <LinkS
                    to="home"
                    spy={true}
                    smooth={true}
                    offset={offset}
                    duration={500}
                    onClick={closeMenu}
                  >
                    Home
                  </LinkS>
                </li>
                <li>
                  <LinkS
                    to="menu"
                    spy={true}
                    smooth={true}
                    offset={offset}
                    duration={500}
                    onClick={closeMenu}
                  >
                    Menu
                  </LinkS>
                </li>
                <li>
                  <LinkS
                    to="about"
                    spy={true}
                    smooth={true}
                    offset={offset}
                    duration={500}
                    onClick={closeMenu}
                  >
                    About Us
                  </LinkS>
                </li>
                <li>
                  <LinkS
                    to="services"
                    spy={true}
                    smooth={true}
                    offset={offset}
                    duration={500}
                    onClick={closeMenu}
                  >
                    Services
                  </LinkS>
                </li>
              </ul>
              <button className="logout-btn ignoreCloseMenu" onClick={logout}>
                <MdOutlineLogout />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <LinkR to="/sign-in" className="login-btn" ref={loginBtnRef}>
            {loginBtnText ? "Sign In" : <MdLogin />}
          </LinkR>
        )}
      </div>
    </nav>
  );
};

export default Header;

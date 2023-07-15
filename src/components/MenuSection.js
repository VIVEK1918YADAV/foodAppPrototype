import React from "react";
import HotContainer from "./HotContainer";
import MenuContainer from "./MenuContainer";
import { useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  getCartItems,
  getHotItems,
  saveCartItem,
} from "../utils/firebaseFunctions";
import { setCartItems } from "../reducers/userSlice";
import MessageModal from "./MessageModal";
import Loading from "./Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase.config";
import { useEffect } from "react";

const MenuSection = ({ closeMenu }) => {
  const { foodItems, isMenuOpen } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [user] = useAuthState(firebaseAuth);

  const modalDuration = 3000;
  const [modalTimeout, setModalTimeout] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [offsetVal, setOffsetVal] = useState(0);
  const [modal, setModal] = useState({
    isModal: false,
    type: "danger",
    message: "",
  });
  const [hotItems, setHotItems] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const dishContainerRef = useRef();
  const dishCardRef = useRef();

  const getScrollOffset = () => {
    const value =
      parseInt(
        window.getComputedStyle(dishCardRef.current).getPropertyValue("width")
      ) +
      parseInt(
        window
          .getComputedStyle(dishContainerRef.current)
          .getPropertyValue("gap")
      );
    setOffsetVal(value);
  };
  const scrollDish = (scrollOffset) => {
    dishContainerRef.current.scrollLeft += scrollOffset;
  };

  const filterItems = useCallback(
    (urlParamName) => {
      setItemList(foodItems.filter((item) => item.category === urlParamName));
    },
    [foodItems]
  );

  const setAdd2CartBtnHover = () => {
    var elements = document.querySelectorAll(".add2cart-btn");
    if (window.innerWidth > 480) {
      if (!elements[0].classList.contains("hover")) {
        elements.forEach((element) => {
          element.classList.add("hover");
        });
      }
    } else {
      if (elements[0].classList.contains("hover")) {
        elements.forEach((element) => {
          element.classList.remove("hover");
        });
      }
    }
  };

  const fetchCartItems = async (uid) => {
    await getCartItems(uid).then((data) => {
      dispatch(setCartItems(data));

      setAddingToCart(false);
      setModal({
        isModal: true,
        type: "success",
        message: "Item added to cart",
      });
      const transitionDuration = 200;
      setModalTimeout(
        setTimeout(() => {
          setModal({ ...modal, isModal: false });
        }, modalDuration + transitionDuration)
      );
    });
  };

  const addToCart = async (uid, item) => {
    clearTimeout(modalTimeout);
    setModal({ ...modal, isModal: false });
    setAddingToCart(true);
    await saveCartItem(uid, item);
    fetchCartItems(uid);
  };

  const showErrorModal = () => {
    clearTimeout(modalTimeout);
    setModal({ ...modal, isModal: false });
    setTimeout(() => {
      setModal({
        isModal: true,
        type: "danger",
        message: "Login to add item to cart",
      });
    }, 0);
    const transitionDuration = 200;
    setModalTimeout(
      setTimeout(() => {
        setModal({ ...modal, isModal: false });
      }, modalDuration + transitionDuration)
    );
  };

  const getMostPopularItems = async () => {
    const items = await getHotItems();
    setHotItems(items);
  };

  useEffect(() => {
    getMostPopularItems();
  }, []);

  return (
    <section
      className="menu-section"
      id="menu"
      onClick={() => {
        if (user && isMenuOpen) {
          closeMenu();
        }
      }}
    >
      <section className="hot-container">
        <div className="hot-header container-header">
          <h2 className="hot-heading container-heading">Our BestSellers</h2>
          <div className="slide-btn-container">
            <button
              className="slide-btn"
              onClick={() => scrollDish(-offsetVal)}
            >
              <MdKeyboardArrowLeft />
            </button>
            <button className="slide-btn" onClick={() => scrollDish(offsetVal)}>
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
        {foodItems ? (
          <HotContainer
            foodItems={hotItems}
            dishContainerRef={dishContainerRef}
            dishCardRef={dishCardRef}
            getScrollOffset={getScrollOffset}
            addToCart={addToCart}
            showErrorModal={showErrorModal}
          />
        ) : (
          <Loading />
        )}
      </section>
      <section className="menu-container">
        <div className="menu-header container-header">
          <h2 className="menu-heading container-heading">Our Menu</h2>
        </div>
        {foodItems ? (
          <MenuContainer
            itemList={itemList}
            filterItems={filterItems}
            setAdd2CartBtnHover={setAdd2CartBtnHover}
            addToCart={addToCart}
            showErrorModal={showErrorModal}
          />
        ) : (
          <Loading />
        )}
      </section>
      {addingToCart && (
        <div id="add2cart-overlay">
          <div className="loaderBg">
            <div className="loader"></div>
          </div>
        </div>
      )}
      {modal.isModal && (
        <MessageModal
          modalDuration={modalDuration}
          type={modal.type}
          message={modal.message}
          page={"menu"}
        />
      )}
    </section>
  );
};

export default MenuSection;

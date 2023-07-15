import React, { useState, useEffect } from "react";
import { categories } from "../utils/data";
import { MdShoppingBasket, MdRestaurantMenu } from "react-icons/md";
import NotFound from "../Images/NotFound.svg";
import { useSelector } from "react-redux";

const MenuContainer = ({
  itemList,
  filterItems,
  setAdd2CartBtnHover,
  addToCart,
  showErrorModal,
}) => {
  const { userInfo } = useSelector((state) => state.userData);

  const [filter, setFilter] = useState(categories[0].urlParamName);

  useEffect(() => {
    filterItems(categories[0].urlParamName);
  }, [filterItems]);

  useEffect(() => {
    window.addEventListener("resize", setAdd2CartBtnHover);
    return () => window.removeEventListener("resize", setAdd2CartBtnHover);
  }, [setAdd2CartBtnHover]);

  return (
    <>
      <div className="menu-category">
        {categories.map((category) => {
          const { id, name, urlParamName } = category;
          return (
            <button
              className={`category-btn ${
                filter === urlParamName ? "selected" : null
              }`}
              key={id}
              onClick={() => {
                setFilter(urlParamName);
                filterItems(urlParamName);
              }}
            >
              <div className="menu-icon">
                <MdRestaurantMenu />
              </div>
              <p className="category-name">{name}</p>
            </button>
          );
        })}
      </div>
      <div className="menu-dish-container">
        {itemList && itemList.length > 0 ? (
          <div className="menu-dishes">
            {itemList.map((item) => {
              const { id, title, calories, imageURL, price } = item;
              return (
                <article className="menu-card dish-card" key={id}>
                  <div className="dish-primary">
                    <div className="dish-img">
                      <img src={imageURL} alt={title} />
                    </div>
                    <button
                      className={`add2cart-btn ${
                        window.innerWidth > 480 && "hover"
                      }`}
                      onClick={() =>
                        userInfo
                          ? addToCart(userInfo?.uid, item)
                          : showErrorModal()
                      }
                    >
                      <p>Add</p>
                      <div className="add-to-cart">
                        <MdShoppingBasket />
                      </div>
                    </button>
                  </div>
                  <div className="dish-info">
                    <p className="dish-name">{title}</p>
                    <p className="dish-calories">{calories} calories</p>
                    <p className="dish-price">
                      <span>₹</span> {price}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="not-found">
            <img src={NotFound} alt="Empty" />
            <p>Items Not Available</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuContainer;

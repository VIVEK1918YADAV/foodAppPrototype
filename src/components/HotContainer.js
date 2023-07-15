import React from "react";
import { MdShoppingBasket } from "react-icons/md";
import { useSelector } from "react-redux";
import NotFound from "../Images/NotFound.svg";

const HotContainer = ({
  foodItems,
  dishContainerRef,
  dishCardRef,
  getScrollOffset,
  addToCart,
  showErrorModal,
}) => {
  const { userInfo } = useSelector((state) => state.userData);

  return (
    <>
      <div className="hot-dishes" ref={dishContainerRef}>
        {foodItems && foodItems.length > 0 ? (
          foodItems.map((item) => {
            const { id, title, calories, imageURL, price } = item;
            const priceFloat = parseFloat(price);
            return (
              <article
                className="hot-card dish-card"
                key={id}
                ref={dishCardRef}
                onLoad={getScrollOffset}
              >
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
                    <span>₹</span> {priceFloat}
                  </p>
                </div>
              </article>
            );
          })
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

export default HotContainer;

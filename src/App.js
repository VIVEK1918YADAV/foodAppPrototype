import React, { useCallback, useEffect } from "react";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import AdminPage from "./components/AdminPage";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserData,
  getAllFoodItems,
  getCartItems,
} from "./utils/firebaseFunctions";
import { setCartItems, setFoodItems, setUserInfo } from "./reducers/userSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "./firebase.config";
import ErrorPage from "./components/ErrorPage";

function App() {
  const {
    userInfo,
    cart: { isOpen },
  } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [user, loading] = useAuthState(firebaseAuth);

  const fetchData = useCallback(async () => {
    await getAllFoodItems().then((data) => {
      dispatch(setFoodItems(data));
    });
  }, []);

  const fetchCartItems = useCallback(async (uid) => {
    await getCartItems(uid).then((data) => {
      dispatch(setCartItems(data));
    });
  }, []);

  const fetchUserDetails = useCallback(async (uid) => {
    const data = await fetchUserData(uid);
    dispatch(setUserInfo(data));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchCartItems(userInfo?.uid);
  }, [userInfo, fetchCartItems]);

  useEffect(() => {
    if (loading) return;
    if (user) {
      fetchUserDetails(user.email);
    }
  }, [user, loading, fetchUserDetails]);

  // disabling body scroll if cart is open
  useEffect(() => {
    const body = document.querySelector("body");
    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} exact="true" />
        <Route path="/sign-in" element={<SignIn />} />
        {/* admin only */}
        <Route
          path="/admin/*"
          element={
            user && userInfo?.accountType === "admin" ? (
              <AdminPage />
            ) : (
              <ErrorPage />
            )
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main>
  );
}

export default App;

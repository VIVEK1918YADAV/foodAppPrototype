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
    const data = await getAllFoodItems();
    dispatch(setFoodItems(data));
  }, [dispatch]);

  const fetchCartItems = useCallback(async (uid) => {
    const data = await getCartItems(uid);
    dispatch(setCartItems(data));
  }, [dispatch]);

  const fetchUserDetails = useCallback(async (uid) => {
    const data = await fetchUserData(uid);
    dispatch(setUserInfo(data));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (userInfo?.uid) {
      fetchCartItems(userInfo.uid);
    }
  }, [userInfo?.uid, fetchCartItems]);

  useEffect(() => {
    if (!loading && user) {
      fetchUserDetails(user.email);
    }
  }, [user, loading, fetchUserDetails]);

  // Disabling body scroll if cart is open
  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);
///last ocmit
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} exact={true} />
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

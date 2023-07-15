import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firebaseAuth, firestore } from "../firebase.config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// Registering new user
export const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = result.user;
    const userData = {
      uid: user.email,
      name,
      image: user.photoURL,
      wallet: 0,
      authProvider: "google",
      accountType: "local",
    };
    const docRef = doc(firestore, "users", user.email);
    await setDoc(docRef, userData, { merge: true });
    return { type: "success", message: "Registeration successful" };
  } catch (err) {
    console.error(err);
    return { type: "danger", message: err.code };
  }
};

// Direct user login
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    return "success";
  } catch (err) {
    console.error(err);
    return { type: "danger", message: err.code };
  }
};

// Google sign-in
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  // provider.addScope("")

  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;
    const userData = {
      uid: user.email,
      name: user.displayName,
      image: user.photoURL,
      wallet: 0,
      authProvider: "google",
      accountType: "local",
    };

    const docRef = doc(firestore, "users", user.email);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, userData, { merge: true });
    }
    return "success";
  } catch (err) {
    console.error(err);
    return { type: "danger", message: err.code };
  }
};

//  fetch user data
export const fetchUserData = async (uid) => {
  try {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.error(err);
  }
  return null;
};

//  check user accountType
export const checkUserPrivilege = async (uid) => {
  try {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data().accountType;
  } catch (err) {
    console.error(err);
  }
  return null;
};

// Saving new Item
export const saveItem = async (data) => {
  const docRef = doc(firestore, "foodItems", `${Date.now()}`);
  await setDoc(docRef, data, { merge: true });
};

// Get all food items
export const getAllFoodItems = async () => {
  const dbRef = collection(firestore, "foodItems");
  const docsSnap = await getDocs(query(dbRef, orderBy("id", "desc")));
  return docsSnap.docs.map((doc) => doc.data());
};

// Saving Cart items
export const saveCartItem = async (uid, data) => {
  const docRef = doc(firestore, uid + "_cartItems", data.id);

  // check if item already present
  const cartItems = await getCartItems(uid);
  const item = cartItems.find((obj) => obj.id === data.id);
  if (item) {
    await updateCartItem(uid, item, 1);
    return;
  }

  const date = `${Date.now()}`;
  await setDoc(docRef, { ...data, date }, { merge: true });
};

// Updating a cart item
export const updateCartItem = async (uid, item, val) => {
  const docRef = doc(firestore, uid + "_cartItems", item.id);
  if (item.qty + val !== 0) {
    await updateDoc(docRef, { qty: item.qty + val }, { merge: true });
  } else {
    await deleteCartItem(uid, item);
  }
};

// Deleting a cart item
export const deleteCartItem = async (uid, item) => {
  const docRef = doc(firestore, uid + "_cartItems", item.id);
  await deleteDoc(docRef);
};

// Deleting entire collection
export const deleteAllCartItem = async (uid) => {
  const dbRef = collection(firestore, uid + "_cartItems");
  const docsSnap = await getDocs(query(dbRef, orderBy("id", "desc")));

  // Delete documents in a batch
  const batch = writeBatch(firestore);
  docsSnap.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

// Get Cart items
export const getCartItems = async (uid) => {
  const dbRef = collection(firestore, uid + "_cartItems");
  const docsSnap = await getDocs(query(dbRef, orderBy("date", "desc")));
  return docsSnap.docs.map((doc) => doc.data());
};

// Get hot items
export const getHotItems = async () => {
  const dbRef = collection(firestore, "foodItems");
  const docsSnap = await getDocs(
    query(dbRef, orderBy("order_qty", "desc"), limit(10))
  );
  return docsSnap.docs.map((doc) => doc.data());
};

// Join Premium button
export const joinUserPremium = async (uid) => {
  const docRef = doc(firestore, "users", uid);
  await updateDoc(docRef, { accountType: "premium" }, { merge: true });
};

// Cart checkout
export const userCartCheckout = async (uid, cartItems, wallet, cashback) => {
  // updating food items
  for (let i = 0; i < cartItems.length; i++) {
    const foodRef = doc(firestore, "foodItems", cartItems[i].id);
    const foodSnap = await getDoc(foodRef);
    const foodItem = foodSnap.data();
    await updateDoc(
      foodRef,
      { order_qty: foodItem.order_qty + cartItems[i].qty },
      { merge: true }
    );
  }

  // updating user
  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, { wallet: wallet + cashback }, { merge: true });
};

import React, { useState, useEffect, useRef } from "react";
import { MdChevronRight } from "react-icons/md";
import { BsShieldLock } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  checkUserPrivilege,
  googleSignIn,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "../utils/firebaseFunctions";
import { firebaseAuth } from "../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";

const SignIn = (e) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const [user, loading] = useAuthState(firebaseAuth);
  const navigate = useNavigate();

  const modalDuration = 3000;
  const [modalTimeout, setModalTimeout] = useState(null);
  const [modal, setModal] = useState({
    isModal: false,
    type: "danger",
    message: "",
  });

  const NameInputRef = useRef();
  const EmailInputRef = useRef();
  const PasswordInputRef = useRef();
  const SignInBtnRef = useRef();

  const submitDetails = async () => {
    clearTimeout(modalTimeout);
    setModal({ ...modal, isModal: false });

    let status = "";
    if (isNewUser) {
      if (!name || !email || !password) {
        setTimeout(() => {
          setModal({
            isModal: true,
            type: "danger",
            message: "Please fill all the fields!!",
          });
        }, 0);
        const transitionDuration = 200;
        setModalTimeout(
          setTimeout(() => {
            setModal({ ...modal, isModal: false });
          }, modalDuration + transitionDuration)
        );
        return;
      }
      status = await registerWithEmailAndPassword(name, email, password);
    } else {
      if (!email || !password) {
        setTimeout(() => {
          setModal({
            isModal: true,
            type: "danger",
            message: "Please fill all the fields!!",
          });
        }, 0);
        const transitionDuration = 200;
        setModalTimeout(
          setTimeout(() => {
            setModal({ ...modal, isModal: false });
          }, modalDuration + transitionDuration)
        );
        return;
      }
      status = await logInWithEmailAndPassword(email, password);
    }

    if (status !== "success") {
      setTimeout(() => {
        setModal({
          isModal: true,
          type: status.type,
          message: status.message,
        });
      }, 0);
      const transitionDuration = 200;
      setModalTimeout(
        setTimeout(() => {
          setModal({ ...modal, isModal: false });
        }, modalDuration + transitionDuration)
      );
    }
  };

  const googleLogin = async () => {
    clearTimeout(modalTimeout);
    setModal({ ...modal, isModal: false });

    const status = await googleSignIn();
    if (status !== "success") {
      setTimeout(() => {
        setModal({
          isModal: true,
          type: status.type,
          message: status.message,
        });
      }, 0);
      const transitionDuration = 200;
      setModalTimeout(
        setTimeout(() => {
          setModal({ ...modal, isModal: false });
        }, modalDuration + transitionDuration)
      );
    }
  };

  const checkUserAccountType = async (id) => {
    const accountType = await checkUserPrivilege(id);
    if (accountType !== "admin") {
      navigate("/");
    } else {
      navigate("/admin/dashboard");
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      checkUserAccountType(user.email);
    }
  }, [user, loading]);

  return (
    <div className="signin-page">
      <div className="circleBg"></div>
      <div className="circleBg"></div>
      <div className="circleBg"></div>

      <div className="signin-container">
        {loading && (
          <div id="signin-overlay">
            <div className="loaderBg">
              <div className="loader"></div>
            </div>
          </div>
        )}
        <div className="signin-content">
          <FaShapes className="shapes-icon" />
          <div className="brand-logo">
            <div className="logo-text">
              H<span className="small">un</span>G
              <span className="small">reed</span>
            </div>
          </div>
          {isNewUser ? (
            <div className="signin-greet">
              <h1>New User?</h1>
              <p>Sign up and discover a whole new world of delicacies.</p>
            </div>
          ) : (
            <div className="signin-greet">
              <h1>Welcome Back!</h1>
              <p>Sign in for better access</p>
            </div>
          )}
          <footer>
            <hr />
            <p> Hungreed coorporation pvt. ltd.</p>
          </footer>
        </div>

        <div className="signin-main">
          <BsShieldLock className="shield-icon" />
          <div className="brand-logo">
            <div className="logo-text">
              <span>H</span>
              <span className="small">un</span>
              <span>G</span>
              <span className="small">reed</span>
            </div>
          </div>
          {isNewUser ? <h1>Create Account</h1> : <h1>Welcome Back</h1>}
          <div className="signin-options">
            {isNewUser ? (
              <h2 className="signin-heading">Sign Up</h2>
            ) : (
              <h2 className="signin-heading">Sign In</h2>
            )}
            {/* <form action="" className="signin-direct"> */}
            <div className="signin-direct">
              {isNewUser && (
                <input
                  type="text"
                  placeholder="Name"
                  ref={NameInputRef}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                ref={EmailInputRef}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                ref={PasswordInputRef}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="signin-btn"
                ref={SignInBtnRef}
                onClick={submitDetails}
              >
                <p>{isNewUser ? "create" : "log in"}</p>{" "}
                <MdChevronRight className="right-icon" />
              </button>
            </div>
            {/* </form> */}
            <div className="signin-partners">
              <div className="signin-partners-head">
                <hr />
                <p>or sign up/in using</p>
                <hr />
              </div>
              <button
                type="submit"
                className="google-signin-btn"
                onClick={googleLogin}
              >
                <FcGoogle className="google-icon" /> google
              </button>
            </div>
            {isNewUser ? (
              <p className="signup-link">
                Already have an account?{" "}
                <span onClick={() => setIsNewUser(false)}>sign in</span>
              </p>
            ) : (
              <p className="signup-link">
                New User?{" "}
                <span onClick={() => setIsNewUser(true)}>register</span>
              </p>
            )}
          </div>
        </div>
        {modal.isModal && (
          <MessageModal
            modalDuration={modalDuration}
            type={modal.type}
            message={modal.message}
            page={"signin"}
          />
        )}
      </div>
    </div>
  );
};

export default SignIn;

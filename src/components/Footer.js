import React from "react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = ({ closeMenu }) => {
  const { isMenuOpen } = useSelector((state) => state.userData);

  return (
    <footer
      className="footer"
      onClick={() => {
        if (isMenuOpen) {
          closeMenu();
        }
      }}
    >
      <div className="footer-vertical">
        <div className="about-links vertical-column">
          <h4>About</h4>
          <ul>
            <li>
              <a href="/">how it works</a>
            </li>
            <li>
              <a href="/">testimonials</a>
            </li>
            <li>
              <a href="/">investores</a>
            </li>
            <li>
              <a href="/">terms of services</a>
            </li>
            <li>
              <a href="/">privacy policy</a>
            </li>
          </ul>
        </div>
        <div className="useful-links vertical-column">
          <h4>useful links</h4>
          <ul>
            <li>
              <a href="/">careers</a>
            </li>
            <li>
              <a href="/">FAQs</a>
            </li>
            <li>
              <a href="/">locate store</a>
            </li>
            <li>
              <a href="/">support</a>
            </li>
            <li>
              <a href="/">help</a>
            </li>
          </ul>
        </div>
        <div className="contact-links vertical-column">
          <h4>contact us</h4>
          <ul>
            <li>
              <MdLocationOn className="contact-icon" />
              <p>
                525-Garuda Street
                <br />
                Mumbai, 230532
                <br />
                India
              </p>
            </li>
            <li>
              <MdEmail className="contact-icon" /> hungreed@gmail.com
            </li>
            <li>
              <MdPhone className="contact-icon" />{" "}
              <p>
                +91-1234 5678 90
                <br />
                +91-1234 5678 99
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="brand-logo">
        <div className="logo-text">
          <span>H</span>
          <span className="small">un</span>
          <span>G</span>
          <span className="small">reed</span>
        </div>
      </div>
      <div className="footer-social-media">
        <p>follow us on</p>
        <ul>
          <li>
            <a href="https://www.instagram.com/">
              <FaInstagram className="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.twitter.com/">
              <FaTwitter className="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/">
              <FaFacebook className="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/">
              <FaYoutube className="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/">
              <FaLinkedin className="social-icon" />
            </a>
          </li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>HunGreed © 2014 All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

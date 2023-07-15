import React from "react";
import Discount from "../Images/discount.png";
import Premium from "../Images/premium-discount.png";
import Celebration from "../Images/celebration.png";
import GlobalChain from "../Images/global-chain.png";
import Aid from "../Images/aid.png";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase.config";

const ServicesSection = ({ closeMenu }) => {
  const { isMenuOpen } = useSelector((state) => state.userData);
  const [user] = useAuthState(firebaseAuth);

  return (
    <section
      className="services-section"
      id="services"
      onClick={() => {
        if (user && isMenuOpen) {
          closeMenu();
        }
      }}
    >
      <div className="services-header">
        <h1 className="service-heading">
          Our <span>Services</span>
        </h1>
        <div className="divider-line"></div>
        <p className="services-para">
          Fastest delivery in your city with a wide variety of options to choose
          from and an authentic taste.
        </p>
      </div>

      <div className="services-container">
        <article className="service-card">
          <div className="service-img">
            <img src={Premium} alt="" />
          </div>
          <div className="service-info">
            <h4 className="service-name">Premium Benefits</h4>
            <p className="service-desc">
              Unlock premium benefits like upto <span>5% cashback</span>,{" "}
              <span>Free</span> delivery, and much more with HunGreed Premium
              membership.
            </p>
            {/* <button className="service-btn">More</button> */}
          </div>
        </article>
        <article className="service-card">
          <div className="service-img">
            <img src={Celebration} alt="" />
          </div>
          <div className="service-info">
            <h4 className="service-name">Party Discount</h4>
            <p className="service-desc">
              <span>Special discount</span> on large orders on your special
              occasions. To avail contact us.
              <br />
              <br />
              <span>Email</span> - hungreed@gmail.com
            </p>
            {/* <button className="service-btn">More</button> */}
          </div>
        </article>
        <article className="service-card">
          <div className="service-img">
            <img src={GlobalChain} alt="" />
          </div>
          <div className="service-info">
            <h4 className="service-name">Global Chain</h4>
            <p className="service-desc">
              Find the same <span>Authentic</span> HunGreed taste everywhere in
              the world with our global food chain across{" "}
              <span>75+ countries</span>.
            </p>
            {/* <button className="service-btn">More</button> */}
          </div>
        </article>
        <article className="service-card">
          <div className="service-img">
            <img src={Aid} alt="" />
          </div>
          <div className="service-info">
            <h4 className="service-name">Human Aid</h4>
            <p className="service-desc">
              <span>1%</span> of <span>our profit</span> goes to aid the poor
              and unfortunate in the form of Education, Humanitarian aid during
              calamities, etc.
            </p>
            {/* <button className="service-btn">More</button> */}
          </div>
        </article>
        <article className="service-card">
          <div className="service-img">
            <img src={Discount} alt="" />
          </div>
          <div className="service-info">
            <h4 className="service-name">Festival Discounts</h4>
            <p className="service-desc">
              Extra <span>discount</span> on festivals to make your smile big
              and day more special.
            </p>
            {/* <button className="service-btn">More</button> */}
          </div>
        </article>
      </div>
    </section>
  );
};

export default ServicesSection;

// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ShareOnSocialMedia from './ShareOnSocialMedia'; // Importar el componente
import './Home.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const promotions = [
    {
      id: 1,
      title: 'Get $50 on Your First Sign Up!',
      description: 'Create an account and receive a bonus of $50 to kickstart your savings.',
    },
    {
      id: 2,
      title: 'Refer a Friend and Earn Rewards!',
      description: 'Invite friends to join and earn $25 for each successful referral.',
    },
    {
      id: 3,
      title: 'No Fees for the First Year!',
      description: 'Enjoy no monthly maintenance fees for the first year when you open a new account.',
    },
    {
      id: 4,
      title: 'Exclusive Loan Rates for Members!',
      description: 'Join now to access exclusive low-interest rates on personal loans.',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2000, 
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Bank ATM Simulator</h1>
        <p>Your personal online banking experience, designed to help you manage your finances with ease.</p>
        <Link to="/SignIn" className="cta-button">Get Started</Link>
      </header>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-list">
          <div className="feature">
            <h3>Secure Transactions</h3>
            <p>Experience secure and seamless transactions with our state-of-the-art encryption technology.</p>
          </div>
          <div className="feature">
            <h3>Account Management</h3>
            <p>Easily check your balance, withdraw, deposit, and transfer money anytime, anywhere.</p>
          </div>
          <div className="feature">
            <h3>Real-time Updates</h3>
            <p>Receive instant updates on your account activity and transaction history.</p>
          </div>
        </div>
      </section>

      <section className="promotions-section">
        <h2>Explore Promotions</h2>
        <Slider {...settings}>
          {promotions.map(promotion => (
            <div key={promotion.id} className="promotion">
              <h3>{promotion.title}</h3>
              <p>{promotion.description}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Dividir el footer en dos secciones */}
      <footer className="home-footer">
        <div className="footer-main">
          <p>Join us and simulate real banking transactions in a secure environment.</p>
          <Link to="/SignUp" className="cta-button">Create Account</Link>
        </div>

        <div className="footer-share">
          <ShareOnSocialMedia />
        </div>
      </footer>
    </div>
  );
};

export default Home;

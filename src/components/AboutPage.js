import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

const guideSteps = [
  'Create an account or sign in to your existing profile.',
  'Open the ATM dashboard to review your checking and savings accounts.',
  'Choose a service such as transfer, payment, recent activity, or account security.',
  'Confirm each action carefully before submitting banking changes.',
  'Review your activity history to keep track of completed transactions.',
];

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: "Use the Forgot Password link on the sign-in page and follow the security prompts.",
  },
  {
    question: 'Can I transfer money between my accounts?',
    answer: 'Yes. The ATM simulator supports transfers between checking and savings accounts.',
  },
  {
    question: 'Is my information secure?',
    answer: 'The app uses authentication flows and session protection to keep account access controlled.',
  },
  {
    question: 'What types of accounts can I manage?',
    answer: 'You can manage checking and savings account workflows inside the simulator.',
  },
  {
    question: 'Who can I contact for support?',
    answer: 'You can schedule an appointment, submit feedback, or rate your customer experience from this page.',
  },
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <article className={`about-faq-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="about-faq-question"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{question}</span>
        <strong aria-hidden="true">{isOpen ? '-' : '+'}</strong>
      </button>
      <div className="about-faq-answer">
        <p>{answer}</p>
      </div>
    </article>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="about-eyebrow">About the simulator</p>
          <h1>Banking practice that feels clear, guided, and secure.</h1>
          <p className="about-lede">
            ATMSimulator helps users explore everyday banking actions, manage account tasks, and
            understand transaction workflows in a simple digital ATM experience.
          </p>
          <div className="about-actions">
            <button type="button" className="about-primary-action" onClick={() => navigate('/SignIn')}>
              Start banking
            </button>
            <button type="button" className="about-secondary-action" onClick={() => navigate('/Locator')}>
              Find an ATM
            </button>
          </div>
        </div>

        <div className="about-preview" aria-label="ATM simulator overview">
          <div className="about-preview-screen">
            <span>Session ready</span>
            <strong>$4,280.00</strong>
            <small>Available balance</small>
          </div>
          <div className="about-preview-list">
            <span>Checking</span>
            <span>Transfer</span>
            <span>Payments</span>
            <span>Security</span>
          </div>
        </div>
      </section>

      <section className="about-section about-guide-section">
        <div className="about-section-heading">
          <p className="about-eyebrow">User guide</p>
          <h2>Move through the simulator with confidence.</h2>
        </div>

        <div className="about-guide-grid">
          {guideSteps.map((step, index) => (
            <article className="about-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-services-section">
        <div className="about-service-card">
          <span>Appointments</span>
          <h3>Talk with a representative</h3>
          <p>Book a support session when you want help with banking workflows or account questions.</p>
          <button type="button" onClick={() => navigate('/schedule-appointment')}>
            Schedule
          </button>
        </div>

        <div className="about-service-card">
          <span>Experience</span>
          <h3>Share your feedback</h3>
          <p>Rate your customer experience so the simulator can keep improving around real needs.</p>
          <button type="button" onClick={() => navigate('/rate-customer-experience')}>
            Rate experience
          </button>
        </div>

        <div className="about-service-card">
          <span>Locations</span>
          <h3>Find nearby access</h3>
          <p>Use the locator to view available ATM points and focus the map on a selected location.</p>
          <button type="button" onClick={() => navigate('/Locator')}>
            View map
          </button>
        </div>
      </section>

      <section className="about-section about-faq-section">
        <div className="about-section-heading">
          <p className="about-eyebrow">FAQ</p>
          <h2>Quick answers before you start.</h2>
        </div>

        <div className="about-faq-list">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

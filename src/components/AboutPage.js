import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleFAQ = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item">
      <h3 className="faq-question" onClick={toggleFAQ}>
        {question}
      </h3>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();

  const handleScheduleAppointment = () => {
    navigate('/schedule-appointment');
  };

  const handleRateCustomerExperience = () => {
    navigate('/rate-customer-experience'); // Asegúrate de que esta ruta esté definida en tu router
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>About ATMSimulator</h1>
      <p>
        Welcome to ATMSimulator, a user-friendly application designed to help you manage your banking transactions
        seamlessly. Our simulator allows you to interact with your savings and checking accounts, monitor your
        spending, and simulate various banking operations.
      </p>

      <h2>User Guide</h2>
      <p>To get started with ATMSimulator, follow these steps:</p>
      <ol>
        <li>Create an account or log in to your existing account.</li>
        <li>Navigate to the dashboard to view your accounts.</li>
        <li>Select the account you wish to manage (savings or checking).</li>
        <li>Use the transfer feature to move funds between your accounts.</li>
        <li>Monitor your transaction history for any activity.</li>
        <li>Utilize the payment feature to pay bills directly from your checking account.</li>
      </ol>

      <h2>FAQs</h2>
      <FAQItem question="1. How do I reset my password?" answer="If you forget your password, click on the 'Forgot Password' link on the login page and follow the prompts to reset it." />
      <FAQItem question="2. Can I transfer money between my accounts?" answer="Yes, you can easily transfer funds from your savings account to your checking account using the transfer feature." />
      <FAQItem question="3. Is my information secure?" answer="Absolutely! We prioritize your security and ensure that your personal information is protected with the highest encryption standards." />
      <FAQItem question="4. What types of accounts can I manage?" answer="Currently, you can manage both savings and checking accounts within ATMSimulator." />
      <FAQItem question="5. Who can I contact for support?" answer="For any questions or issues, please reach out to our support team via the contact form available in the app." />

      <button onClick={handleScheduleAppointment} className="schedule-button">
        Schedule Appointments with Bank Representatives
      </button>

      <button onClick={handleRateCustomerExperience} className="rate-button">
        Rate Your Customer Experience
      </button>
    </div>
  );
};

export default AboutPage;

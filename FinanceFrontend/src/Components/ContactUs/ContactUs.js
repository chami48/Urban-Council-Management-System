
import "./ContactUs.css";
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';


function ContactUs() {

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_10lxucp', 'template_70qakkg', form.current, {
        publicKey: 'Ybr1KUT15ZYoahsdG',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("Success");
        },
        (error) => {
          console.log('FAILED...', error);
          alert("Not Success");
        },
      );
    }

  return (
    <div>
      <div class="contact-container">
    <h2>Contact Us</h2>

    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
    </form>
  </div>
    </div>
  )

};

export default ContactUs;

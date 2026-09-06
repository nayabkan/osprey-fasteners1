import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/contact.css";

import api from "../services/api";


function Contact() {

  const [form, setForm] = useState({
    contactPerson: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  // =====================================================
  // UPDATE FORM
  // =====================================================

  const update = (e) => {

    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

  };


  // =====================================================
  // SUBMIT CONTACT FORM
  // =====================================================

  const submit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");


    try {

      const response = await api.post(
        "/api/contact/",
        {
          customer_name:
            form.contactPerson,

          email:
            form.email,

          message:
            form.message,
        }
      );


      const data = response.data;


      console.log(
        "CONTACT RESPONSE:",
        data
      );


      setSuccess(
        "Thank you. Our team will review your message and get back to you promptly."
      );


      setForm({
        contactPerson: "",
        email: "",
        message: "",
      });


    } catch (error) {

      console.error(
        "CONTACT ERROR:",
        error
      );


      const message =
        error.response?.data?.detail ||
        error.message ||
        "Something went wrong. Please try again.";


      setError(message);


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="simple-page">

      <Navbar />


      <main className="contact-main">

        <h1>
          Contact Us
        </h1>


        <p className="contact-intro">
          Our team will review your request and get back to you promptly
        </p>


        <div className="contact-grid">


          {/* =====================================================
              CONTACT FORM
          ===================================================== */}

          <form
            onSubmit={submit}
            className="contact-form"
          >


            <label>

              Contact Person*

              <input
                name="contactPerson"
                value={
                  form.contactPerson
                }
                onChange={update}
                required
              />

            </label>


            <label>

              Email*

              <input
                type="email"
                name="email"
                value={
                  form.email
                }
                onChange={update}
                required
              />

            </label>


            <label>

              Message*

              <textarea
                name="message"
                value={
                  form.message
                }
                onChange={update}
                required
              />

            </label>


            {/* SUCCESS MESSAGE */}

            {success && (

              <div className="success-message">
                {success}
              </div>

            )}


            {/* ERROR MESSAGE */}

            {error && (

              <div className="error-message">
                {error}
              </div>

            )}


            <button
              type="submit"
              disabled={loading}
            >

              {
                loading
                  ? "Submitting..."
                  : "Submit"
              }

            </button>


          </form>


          {/* =====================================================
              CONTACT INFORMATION
          ===================================================== */}

          <aside className="contact-info">

            <h2>
              Contact Us
            </h2>


            <p>
              ☎ &nbsp;(425) 502 0717
            </p>


            <p>

              <a href="mailto:sales@ospreyfasteners.com">
                ✉ &nbsp;sales@ospreyfasteners.com
              </a>

            </p>


            <p>

              ⌖ &nbsp; Osprey Fasteners, Osprey

              <br />

              &nbsp;&nbsp;&nbsp;&nbsp;Lane, Fastener Block,

              <br />

              &nbsp;&nbsp;&nbsp;&nbsp;Plano, California 98108

            </p>


          </aside>


        </div>

      </main>


      <Footer />

    </div>

  );

}


export default Contact;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuote } from "../context/QuoteContext";
import { useAuth } from "../context/AuthContext";

import "../styles/quote.css";

import api from "../services/api";

function Quote() {
  const navigate = useNavigate();

  const {
    items,
    updateQuantity,
    removeItem,
    clearItems,
  } = useQuote();

  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [extraParts, setExtraParts] = useState([]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOGIN POPUP
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // =========================
  // SET USER EMAIL
  // =========================

  useEffect(() => {
    if (user?.email) {
      setFormData((current) => ({
        ...current,
        email: user.email,
      }));
    }
  }, [user]);

  // =========================
  // RESET SUCCESS MESSAGE
  // =========================

  useEffect(() => {
    if (items.length) {
      setSubmitted(false);
    }
  }, [items.length]);

  // =========================
  // FORM INPUT
  // =========================

  const handle = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // ADD EXTRA PART
  // =========================

  const addPart = () => {
    setExtraParts((current) => [
      ...current,
      {
        id: Date.now(),
        part: "",
        quantity: 1,
      },
    ]);
  };

  // =========================
  // UPDATE EXTRA PART
  // =========================

  const updateExtra = (id, key, value) => {
    setExtraParts((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  // =========================
  // REMOVE EXTRA PART
  // =========================

  const removeExtraPart = (id) => {
    setExtraParts((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  // =========================
  // SUBMIT REQUEST QUOTE
  // =========================

  const submit = async (e) => {
    e.preventDefault();

    // =========================
    // LOGIN REQUIRED
    // =========================

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setError("");

    try {
      // -------------------------
      // PRODUCTS ALREADY IN QUOTE
      // -------------------------

      const quoteItems = items.map((item) => ({
        product_id: Number(
          item.productId ||
            item.product_id ||
            0
        ),

        part_number:
          item.partNumber ||
          item.part_number ||
          "",

        product_name:
          item.product_name ||
          item.name ||
          "",

        quantity:
          Number(item.quantity) || 1,
      }));

      // -------------------------
      // EXTRA MANUAL PARTS
      // -------------------------

      const manualItems = extraParts
        .filter(
          (item) =>
            item.part.trim() !== ""
        )
        .map((item) => ({
          product_id: 0,

          part_number:
            item.part.trim(),

          product_name: "",

          quantity:
            Number(item.quantity) || 1,
        }));

      // -------------------------
      // COMBINE ALL ITEMS
      // -------------------------

      const allItems = [
        ...quoteItems,
        ...manualItems,
      ];

      if (allItems.length === 0) {
        setError(
          "Please add at least one part to the quote."
        );

        setLoading(false);
        return;
      }

      // -------------------------
      // API PAYLOAD
      // -------------------------

      const payload = {
        company_name:
          formData.companyName,

        contact_person:
          formData.contactPerson,

        email:
          user?.email ||
          formData.email,

        phone:
          formData.phone,

        address:
          formData.address || null,

        message:
          formData.message || null,

        items: allItems,
      };

      console.log(
        "REQUEST QUOTE PAYLOAD:",
        payload
      );

      // -------------------------
      // GET TOKEN
      // -------------------------

      const token =
        localStorage.getItem(
          "access_token"
        );

      // -------------------------
      // API REQUEST
      // -------------------------

      const response = await api.post(
        "/quotes/request",
        payload,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      console.log(
        "REQUEST QUOTE RESPONSE:",
        data
      );

      // -------------------------
      // AUTH ERROR
      // -------------------------

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user"
        );

        setShowLoginPopup(true);
        setLoading(false);

        return;
      }

      // -------------------------
      // ERROR
      // -------------------------

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to submit quote request"
        );
      }

      // -------------------------
      // SUCCESS
      // -------------------------

      setSubmitted(true);

      // Reset form

      setFormData({
        companyName: "",
        contactPerson: "",
        email:
          user?.email || "",
        phone: "",
        address: "",
        message: "",
      });

      setExtraParts([]);

      // Remove items from quote cart

      await clearItems();

    } catch (err) {
      console.error(
        "REQUEST QUOTE ERROR:",
        err
      );

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-page">

      <Navbar />

      <main className="quote-main">

        <div className="quote-container">

          <h1>
            How can we be of service ?
          </h1>

          <p className="quote-description">
            Please use the form below to initiate a
            quote request. Please provide as much
            detail as possible
          </p>

          {/* =========================
              SUCCESS MESSAGE
          ========================= */}

          {submitted && (
            <div className="success-message">
              Quote request submitted successfully.
              Our team will review your request and
              get back to you promptly.
            </div>
          )}

          {/* =========================
              ERROR MESSAGE
          ========================= */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* =========================
              QUOTE FORM
          ========================= */}

          <form
            onSubmit={submit}
            className="quote-form"
          >

            {/* =========================
                COMPANY
            ========================= */}

            <div className="form-group">

              <label>
                Company Name*
              </label>

              <input
                name="companyName"
                value={
                  formData.companyName
                }
                onChange={handle}
                required
              />

            </div>

            {/* =========================
                CONTACT PERSON
            ========================= */}

            <div className="form-group">

              <label>
                Contact Person*
              </label>

              <input
                name="contactPerson"
                value={
                  formData.contactPerson
                }
                onChange={handle}
                required
              />

            </div>

            {/* =========================
                EMAIL
            ========================= */}

            <div className="form-group">

              <label>
                Email*
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={handle}
                required
              />

            </div>

            {/* =========================
                PHONE
            ========================= */}

            <div className="form-group">

              <label>
                Phone*
              </label>

              <input
                type="tel"
                name="phone"
                value={
                  formData.phone
                }
                onChange={handle}
                required
              />

            </div>

            {/* =========================
                ADDRESS
            ========================= */}

            <div className="form-group">

              <label>
                Address (Optional)
              </label>

              <input
                name="address"
                value={
                  formData.address
                }
                onChange={handle}
              />

            </div>

            {/* =========================
                PARTS
            ========================= */}

            <div className="quote-items-block">

              <div className="part-title-row">

                <label>
                  Parts
                </label>

                <button
                  type="button"
                  className="add-part"
                  onClick={addPart}
                >
                  + Add Part
                </button>

              </div>

              {/* =========================
                  PRODUCTS FROM ADD TO QUOTE
              ========================= */}

              {items.length > 0 &&
                items.map((item) => (

                  <div
                    className="part-row"
                    key={item.key}
                  >

                    <div className="part-field">

                      <input
                        value={
                          item.partNumber ||
                          item.name ||
                          ""
                        }
                        readOnly
                      />

                      {item.description && (
                        <small>
                          {
                            item.description
                          }
                        </small>
                      )}

                    </div>

                    <div className="quantity-field">

                      <label>
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          item.quantity
                        }
                        onChange={(e) =>
                          updateQuantity(
                            item.key,
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <button
                      type="button"
                      className="remove-part"
                      onClick={() =>
                        removeItem(
                          item.key
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                ))}

              {/* =========================
                  MANUAL PARTS
              ========================= */}

              {extraParts.map((item) => (

                <div
                  className="part-row"
                  key={item.id}
                >

                  <div className="part-field">

                    <label>
                      Part Number
                    </label>

                    <input
                      value={item.part}
                      onChange={(e) =>
                        updateExtra(
                          item.id,
                          "part",
                          e.target.value
                        )
                      }
                      placeholder="Enter part number"
                    />

                  </div>

                  <div className="quantity-field">

                    <label>
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        item.quantity
                      }
                      onChange={(e) =>
                        updateExtra(
                          item.id,
                          "quantity",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <button
                    type="button"
                    className="remove-part"
                    onClick={() =>
                      removeExtraPart(
                        item.id
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              ))}

              {/* =========================
                  NO ITEMS MESSAGE
              ========================= */}

              {items.length === 0 &&
                extraParts.length === 0 && (

                  <div className="no-parts">

                    No parts added yet. Click
                    "+ Add Part" or add products
                    from Inventory.

                  </div>

                )}

            </div>

            {/* =========================
                MESSAGE
            ========================= */}

            <div className="form-group message-group">

              <label>
                Message (Optional)
              </label>

              <textarea
                name="message"
                value={
                  formData.message
                }
                onChange={handle}
              />

            </div>

            {/* =========================
                SUBMIT
            ========================= */}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit"}
            </button>

          </form>

        </div>

      </main>

      <Footer />

      {/* =================================================
          LOGIN REQUIRED POPUP
      ================================================= */}

      {showLoginPopup && (

        <div className="login-popup-overlay">

          <div className="login-popup">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="login-popup-close"
              onClick={() =>
                setShowLoginPopup(false)
              }
            >
              ×
            </button>

            {/* ICON */}

            <div className="login-popup-icon">
              🔐
            </div>

            {/* TITLE */}

            <h2>
              Login Required
            </h2>

            {/* MESSAGE */}

            <p>
              You need to login before
              submitting a quote.
            </p>

            {/* BUTTONS */}

            <div className="login-popup-buttons">

              <button
                type="button"
                className="popup-cancel-btn"
                onClick={() =>
                  setShowLoginPopup(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="popup-login-btn"
                onClick={() => {

                  setShowLoginPopup(false);

                  navigate("/login", {
                    state: {
                      from: "/quote",
                    },
                  });

                }}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Quote;
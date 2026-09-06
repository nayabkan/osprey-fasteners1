import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useQuote } from "../context/QuoteContext";
import { useAuth } from "../context/AuthContext";

import "../styles/navbar.css";


function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [productsOpen, setProductsOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [search, setSearch] = useState("");


  const inputRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();


  // =====================================================
  // QUOTE
  // =====================================================

  const { count } = useQuote();


  // =====================================================
  // AUTH
  // =====================================================

  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();


  // =====================================================
  // CLOSE MENUS
  // =====================================================

  const closeMenus = () => {

    setMenuOpen(false);

    setProductsOpen(false);

  };


  // =====================================================
  // SEARCH FOCUS
  // =====================================================

  useEffect(() => {

    if (searchOpen) {

      inputRef.current?.focus();

    }

  }, [searchOpen]);


  // =====================================================
  // CLOSE MENUS ON PAGE CHANGE
  // =====================================================

  useEffect(() => {

    closeMenus();

    setSearchOpen(false);

  }, [
    location.pathname,
    location.search
  ]);


  // =====================================================
  // SEARCH
  // =====================================================

  const submitSearch = (e) => {

    e.preventDefault();

    const value = search.trim();


    if (value) {

      navigate(
        `/inventory?search=${encodeURIComponent(value)}`
      );

    } else {

      navigate("/inventory");

    }


    setSearchOpen(false);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    logout();

    closeMenus();

    navigate("/");

  };


  return (

    <header className="site-header">


      {/* =================================================
          TOP BLACK BAR
      ================================================= */}

      <div className="top-bar">

        <div className="top-bar-inner">


          <div className="top-certification">

            <span>
              AS9100D Certified
            </span>

            <span className="top-dot">
              •
            </span>

            <span>
              ASTM &amp; MIL-SPEC Compliant
            </span>

          </div>


          <div className="top-contact">

            <a href="mailto:sales@ospreyfasteners.com">

              <span className="contact-icon email-icon">
                ✉
              </span>

              sales@ospreyfasteners.com

            </a>


            <a href="tel:+14255020717">

              <span className="contact-icon phone-icon">
                ☎
              </span>

              (425) 502 0717

            </a>

          </div>


        </div>

      </div>


      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <nav className="navbar">

        <div className="navbar-container">


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="logo"
            onClick={closeMenus}
            aria-label="Osprey Fasteners home"
          >

            <span className="logo-main">
              Osprey Fasteners
            </span>

          </Link>


          {/* =================================================
              MOBILE BUTTON
          ================================================= */}

          <button
            className="mobile-menu-btn"
            type="button"
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            aria-label="Toggle menu"
          >
            ☰
          </button>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div
            className={`nav-menu ${
              menuOpen ? "open" : ""
            }`}
          >


            {/* HOME */}

            <Link
              to="/"
              className="nav-link"
              onClick={closeMenus}
            >
              Home
            </Link>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="products-menu">

              <button
                type="button"
                className="nav-link products-button"
                onClick={() =>
                  setProductsOpen(
                    (value) => !value
                  )
                }
              >

                <span>
                  Products
                </span>

                <span className="chevron">
                  ⌄
                </span>

              </button>


              {productsOpen && (

                <div className="dropdown">


                  <Link
                    to="/products/nuts"
                    onClick={closeMenus}
                  >
                    Nuts
                  </Link>


                  <Link
                    to="/products?category=Bolts"
                    onClick={closeMenus}
                  >
                    Bolts
                  </Link>


                  <Link
                    to="/products?category=Screws"
                    onClick={closeMenus}
                  >
                    Screws
                  </Link>


                  <Link
                    to="/products?category=Studs"
                    onClick={closeMenus}
                  >
                    Studs
                  </Link>


                  <Link
                    to="/products?category=Set%20Screws"
                    onClick={closeMenus}
                  >
                    Set Screws
                  </Link>


                  <Link
                    to="/products"
                    onClick={closeMenus}
                  >
                    Custom Solutions
                  </Link>


                </div>

              )}

            </div>


            {/* =================================================
                INVENTORY
            ================================================= */}

            <Link
              to="/inventory"
              className="nav-link"
              onClick={closeMenus}
            >
              Inventory
            </Link>


            {/* =================================================
                CONTACT
            ================================================= */}

            <Link
              to="/contact"
              className="nav-link"
              onClick={closeMenus}
            >
              Contact
            </Link>


            {/* =================================================
                CERTIFICATIONS
            ================================================= */}

            <Link
              to="/certifications"
              className="nav-link"
              onClick={closeMenus}
            >
              Certifications
            </Link>


            {/* =================================================
                SEARCH
            ================================================= */}

            <button
              type="button"
              className="search-btn"
              aria-label="Search"
              onClick={() =>
                setSearchOpen(
                  (value) => !value
                )
              }
            >

              <span className="navbar-search-icon"></span>

            </button>


            {/* =================================================
                AUTH
            ================================================= */}

            {isAuthenticated ? (

              <div className="auth-user-menu">

                <span className="auth-user-name">

                  Hi,{" "}

                  {user?.full_name ||
                    user?.email?.split("@")[0] ||
                    "User"}

                </span>


                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

            ) : (

              <div className="auth-buttons">

                <Link
                  to="/login"
                  className="login-btn"
                  onClick={closeMenus}
                >
                  Login
                </Link>

                <span className="auth-separator">/</span>

                <Link
                  to="/register"
                  className="register-btn"
                  onClick={closeMenus}
                >
                  Register
                </Link>

              </div>

            )}


            {/* =================================================
                QUOTE
            ================================================= */}

            <Link
              to="/quote"
              className="quote-btn"
              onClick={closeMenus}
            >

              Request Quote


              {count > 0 && (

                <span className="nav-count">
                  {count}
                </span>

              )}

            </Link>


          </div>

        </div>


        {/* =================================================
            GLOBAL SEARCH
        ================================================= */}

        {searchOpen && (

          <form
            className="global-search"
            onSubmit={submitSearch}
          >

            <input
              ref={inputRef}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by part no, material, size..."
            />


            <button type="submit">
              Search
            </button>

          </form>

        )}


      </nav>

    </header>

  );

}


export default Navbar;
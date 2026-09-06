import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";

const categories = [
  {
    title: "Nuts",
    href: "/products/nuts",
    image: "/images/nuts.png",
  },
  {
    title: "Bolts",
    href: "/products?category=Bolts",
    image: "/images/bolts.png",
  },
  {
    title: "Screws",
    href: "/products?category=Screws",
    image: "/images/screws.png",
  },
  {
    title: "Studs",
    href: "/products?category=Studs",
    image: "/images/studs.png",
  },
  {
    title: "Set Screws",
    href: "/products?category=Set%20Screws",
    image: "/images/set-screws.png",
  },
  {
    title: "Custom Solution",
    href: "/products",
    image: "/images/custom-solution.png",
  },
];

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* ================================
            HERO SECTION
        ================================= */}

        <section className="home-hero">
          <div className="home-hero-copy">
            <h1>Your Trusted Partner for Fasteners</h1>

            <p>
              Osprey Fasteners is a leading supplier of Alloy Steel, Brass,
              Nickel Alloys, Stainless Steel and Titanium fasteners. We proudly
              serve industries like Aerospace, Defense, Marine, Oil &amp; Gas,
              Medical and Construction. We are committed to providing durable
              products and exceptional service.
            </p>

            <div className="home-hero-actions">
              <Link to="/quote" className="home-black-btn">
                Request Quote
              </Link>

              <Link to="/inventory" className="home-white-btn">
                Explore Inventory
              </Link>
            </div>
          </div>

          <div className="home-hero-image">
            <img
              src="/images/fasteners-hero.png"
              alt="Fasteners"
            />
          </div>
        </section>

        {/* ================================
            BROWSE CATEGORIES
        ================================= */}

        <section className="browse-section">
          <h2>Browse by Categories</h2>

          <p>
            Select a category to browse specifications and availability
          </p>

          <div className="category-grid">
            {categories.map((item) => (
              <article
                className="home-category-card"
                key={item.title}
              >
                {/* CATEGORY IMAGE */}

                <div className="category-image">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                {/* CATEGORY DETAILS */}

                <h3>{item.title}</h3>

                <p>
                  A wide variety of{" "}
                  {item.title.toLowerCase()} for all your
                  fastener needs.
                </p>

                <Link to={item.href}>
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/products.css";

const products = [
  {
    id: 1,
    name: "Hex Head Bolt",
    category: "Bolts",
    material: "Stainless Steel",
    grade: "B8M",
    standard: "ASTM A193",
    size: '1/2" × 2"',
    partNumber: "OS-BLT-001",
  },
  {
    id: 2,
    name: "Heavy Hex Nut",
    category: "Nuts",
    material: "Stainless Steel",
    grade: "8M",
    standard: "ASTM A194",
    size: '1/2"',
    partNumber: "OS-NUT-001",
  },
  {
    id: 3,
    name: "Socket Head Cap Screw",
    category: "Screws",
    material: "Alloy Steel",
    grade: "12.9",
    standard: "DIN 912",
    size: 'M10 × 40',
    partNumber: "OS-SCR-001",
  },
  {
    id: 4,
    name: "Threaded Stud",
    category: "Studs",
    material: "Alloy Steel",
    grade: "B7",
    standard: "ASTM A193",
    size: '3/4" × 4"',
    partNumber: "OS-STU-001",
  },
  {
    id: 5,
    name: "Set Screw",
    category: "Set Screws",
    material: "Stainless Steel",
    grade: "316",
    standard: "DIN 913",
    size: "M8 × 20",
    partNumber: "OS-SET-001",
  },
  {
    id: 6,
    name: "Flange Bolt",
    category: "Bolts",
    material: "Carbon Steel",
    grade: "10.9",
    standard: "ISO 4162",
    size: "M12 × 50",
    partNumber: "OS-BLT-002",
  },
  {
    id: 7,
    name: "Lock Nut",
    category: "Nuts",
    material: "Stainless Steel",
    grade: "316",
    standard: "DIN 985",
    size: "M10",
    partNumber: "OS-NUT-002",
  },
  {
    id: 8,
    name: "Machine Screw",
    category: "Screws",
    material: "Stainless Steel",
    grade: "A2",
    standard: "DIN 7985",
    size: "M6 × 30",
    partNumber: "OS-SCR-002",
  },
];

const categories = [
  "All",
  "Nuts",
  "Bolts",
  "Screws",
  "Studs",
  "Set Screws",
];

function Products() {
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "All"
  );

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const searchText = search.toLowerCase();

      const searchMatch =
        product.name.toLowerCase().includes(searchText) ||
        product.partNumber.toLowerCase().includes(searchText) ||
        product.material.toLowerCase().includes(searchText) ||
        product.grade.toLowerCase().includes(searchText);

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, search]);

  return (
    <div>
      <Navbar />

      <main className="products-page">

        <section className="products-header">
          <div className="products-header-inner">

            <span className="section-label">
              OUR INVENTORY
            </span>

            <h1>
              Precision
              <br />
              <span>Fasteners</span>
            </h1>

            <p>
              Explore our range of precision-engineered
              fasteners designed for demanding industrial
              applications.
            </p>

          </div>
        </section>

        <section className="products-section">

          <div className="products-toolbar">

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="product-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          <div className="products-count">
            Showing {filteredProducts.length} products
          </div>

          <div className="products-grid">

            {filteredProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <div className="product-shape">
                    <div className="shape-head"></div>
                    <div className="shape-body"></div>
                    <div className="shape-thread"></div>
                  </div>

                  <span className="product-category">
                    {product.category}
                  </span>

                </div>

                <div className="product-info">

                  <span className="part-number">
                    {product.partNumber}
                  </span>

                  <h3>{product.name}</h3>

                  <p>
                    {product.material} · {product.grade}
                  </p>

                  <div className="product-bottom">

                    <span>
                      {product.size}
                    </span>

                    <span className="product-arrow">
                      →
                    </span>

                  </div>

                </div>

              </Link>
            ))}

          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>
                Try another product name, material or category.
              </p>
            </div>
          )}

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Products;
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/product-details.css";

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
    thread: "UNC",
    finish: "Plain",
    availability: "In Stock",
    description:
      "High-strength hex head bolt engineered for demanding industrial applications and reliable structural connections.",
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
    thread: "UNC",
    finish: "Plain",
    availability: "In Stock",
    description:
      "Precision-manufactured heavy hex nut designed to provide secure and reliable fastening performance.",
  },
  {
    id: 3,
    name: "Socket Head Cap Screw",
    category: "Screws",
    material: "Alloy Steel",
    grade: "12.9",
    standard: "DIN 912",
    size: "M10 × 40",
    partNumber: "OS-SCR-001",
    thread: "Metric",
    finish: "Black Oxide",
    availability: "In Stock",
    description:
      "Compact socket head cap screw offering high tensile strength and excellent performance in precision assemblies.",
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
    thread: "UNC",
    finish: "Plain",
    availability: "In Stock",
    description:
      "Industrial-grade threaded stud manufactured for high-pressure and high-temperature applications.",
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
    thread: "Metric",
    finish: "Plain",
    availability: "In Stock",
    description:
      "Precision set screw for compact fastening applications where a flush connection is required.",
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
    thread: "Metric",
    finish: "Zinc",
    availability: "Limited Stock",
    description:
      "High-strength flange bolt designed to distribute clamping load and provide reliable connections.",
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
    thread: "Metric",
    finish: "Plain",
    availability: "In Stock",
    description:
      "Self-locking nut designed to resist loosening under vibration and demanding operating conditions.",
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
    thread: "Metric",
    finish: "Plain",
    availability: "In Stock",
    description:
      "Reliable machine screw suitable for precision equipment, assemblies and general industrial applications.",
  },
];

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="product-not-found">
          <h1>Product Not Found</h1>

          <Link to="/products">
            ← Back to Products
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="product-details-page">

        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <section className="product-details">

          <div className="details-image-area">

            <div className="details-image">

              <div className="large-product-shape">

                <div className="large-shape-head"></div>

                <div className="large-shape-body"></div>

                <div className="large-shape-thread">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

            </div>

          </div>

          <div className="details-content">

            <span className="details-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <span className="details-part-number">
              {product.partNumber}
            </span>

            <p className="details-description">
              {product.description}
            </p>

            <div className="specifications">

              <h3>Specifications</h3>

              <div className="spec-grid">

                <div className="spec-item">
                  <span>Material</span>
                  <strong>{product.material}</strong>
                </div>

                <div className="spec-item">
                  <span>Grade</span>
                  <strong>{product.grade}</strong>
                </div>

                <div className="spec-item">
                  <span>Standard</span>
                  <strong>{product.standard}</strong>
                </div>

                <div className="spec-item">
                  <span>Size</span>
                  <strong>{product.size}</strong>
                </div>

                <div className="spec-item">
                  <span>Thread</span>
                  <strong>{product.thread}</strong>
                </div>

                <div className="spec-item">
                  <span>Finish</span>
                  <strong>{product.finish}</strong>
                </div>

              </div>

            </div>

            <div className="availability">
              <span className="availability-dot"></span>
              <strong>{product.availability}</strong>
            </div>

            <Link
              to={`/quote?product=${product.id}`}
              className="details-quote-btn"
            >
              Request a Quote
              <span>→</span>
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
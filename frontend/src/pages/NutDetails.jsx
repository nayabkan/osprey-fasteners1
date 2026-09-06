import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/NutDetails.css";
import { Link, useNavigate } from "react-router-dom";
import { useQuote } from "../context/QuoteContext";
import api from "../services/api";

function NutDetails() {
  const navigate = useNavigate();
  const { addItem } = useQuote();

  // ==========================================
  // PRODUCTS
  // ==========================================

  const [products, setProducts] = useState([]);

  // ==========================================
  // FILTERS
  // ==========================================

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedMaterial, setSelectedMaterial] =
    useState("");

  const [selectedStandard, setSelectedStandard] =
    useState("");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ==========================================
  // LOADING / ERROR
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // FETCH NUTS FROM DATABASE
  // ==========================================

  useEffect(() => {
    const fetchNuts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/products/category/Nuts"
        );

        setProducts(response.data || []);
      } catch (err) {
        console.error(
          "Error fetching nuts:",
          err
        );

        setError(
          "Unable to load nuts from the database."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNuts();
  }, []);


  // ==========================================
  // CATEGORY OPTIONS
  // DATABASE: sub_category
  // ==========================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map(
            (product) =>
              product.sub_category
          )
          .filter(Boolean)
      ),
    ];
  }, [products]);


  // ==========================================
  // MATERIAL OPTIONS
  // DATABASE: material
  // ==========================================

  const materials = useMemo(() => {
    return [
      ...new Set(
        products
          .map(
            (product) =>
              product.material
          )
          .filter(Boolean)
      ),
    ];
  }, [products]);


  // ==========================================
  // STANDARD OPTIONS
  // DATABASE: standard
  //
  // Multiple standards can be stored using ;
  //
  // Example:
  //
  // MS, NASM, NAS, AN;
  // ASTM A193, A194, A563;
  // MIL-DTL-1222J
  // ==========================================

  const standards = useMemo(() => {
    const allStandards = [];

    products.forEach((product) => {
      if (!product.standard) {
        return;
      }

      const productStandards =
        product.standard
          .split(";")
          .map((standard) =>
            standard.trim()
          )
          .filter(Boolean);

      allStandards.push(
        ...productStandards
      );
    });

    return [
      ...new Set(allStandards),
    ];
  }, [products]);


  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      // CATEGORY
      const categoryMatch =
        !selectedCategory ||
        product.sub_category ===
          selectedCategory;


      // MATERIAL
      const materialMatch =
        !selectedMaterial ||
        product.material ===
          selectedMaterial;


      // STANDARD
      const productStandards =
        product.standard
          ? product.standard
              .split(";")
              .map((standard) =>
                standard.trim()
              )
              .filter(Boolean)
          : [];


      const standardMatch =
        !selectedStandard ||
        productStandards.includes(
          selectedStandard
        );


      return (
        categoryMatch &&
        materialMatch &&
        standardMatch
      );
    });
  }, [
    products,
    selectedCategory,
    selectedMaterial,
    selectedStandard,
  ]);


  // ==========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedMaterial,
    selectedStandard,
  ]);


  // ==========================================
  // TOTAL PAGES
  // ==========================================

  const totalPages = Math.ceil(
    filteredProducts.length /
      itemsPerPage
  );


  // ==========================================
  // CURRENT PAGE PRODUCTS
  // ==========================================

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      itemsPerPage;

    const endIndex =
      startIndex +
      itemsPerPage;

    return filteredProducts.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredProducts,
    currentPage,
  ]);


  // ==========================================
  // ADD PRODUCT TO QUOTE
  // ==========================================

  const addNutToQuote = (product) => {
    addItem(
      {
        id: product.id,

        name:
          product.name ||
          "Nut Product",

        partNumber:
          product.part_number,

        description:
          product.description ||
          "",

        material:
          product.material ||
          "",

        category:
          product.sub_category ||
          "",

        grade:
          product.grade ||
          "",

        standard:
          product.standard ||
          "",

        size:
          product.size ||
          "",
      },
      1
    );

    navigate("/quote");
  };


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedMaterial("");
    setSelectedStandard("");
    setCurrentPage(1);
  };


  // ==========================================
  // FILTER CHECK
  // ==========================================

  const hasFilters =
    selectedCategory ||
    selectedMaterial ||
    selectedStandard;


  // ==========================================
  // SHOWING RANGE
  // ==========================================

  const startItem =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const endItem =
    Math.min(
      currentPage * itemsPerPage,
      filteredProducts.length
    );


  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="nut-details-page">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />


      <main>

        {/* ====================================
            HEADER
        ==================================== */}

        <section className="nut-header">

          <h1>Nuts</h1>

          <p>
            Browse our available nut products,
            materials and standards.
          </p>

        </section>


        {/* ====================================
            FILTER SECTION
        ==================================== */}

        <section className="nut-filter-section">


          {/* ==================================
              CATEGORY
          ================================== */}

          <div className="nut-filter">

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}

            </select>

          </div>


          {/* ==================================
              MATERIAL
          ================================== */}

          <div className="nut-filter">

            <label htmlFor="material">
              Materials
            </label>

            <select
              id="material"
              value={selectedMaterial}
              onChange={(e) =>
                setSelectedMaterial(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Material
              </option>

              {materials.map(
                (material) => (
                  <option
                    key={material}
                    value={material}
                  >
                    {material}
                  </option>
                )
              )}

            </select>

          </div>


          {/* ==================================
              STANDARD
          ================================== */}

          <div className="nut-filter">

            <label htmlFor="standard">
              Standards
            </label>

            <select
              id="standard"
              value={selectedStandard}
              onChange={(e) =>
                setSelectedStandard(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Standard
              </option>

              {standards.map(
                (standard) => (
                  <option
                    key={standard}
                    value={standard}
                  >
                    {standard}
                  </option>
                )
              )}

            </select>

          </div>


          {/* ==================================
              CLEAR FILTER
          ================================== */}

          {hasFilters && (
            <div className="clear-control">

              <button
                type="button"
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          )}

        </section>


        {/* ====================================
            PRODUCTS SECTION
        ==================================== */}

        <section className="nut-products-section">


          {/* ==================================
              HEADING
          ================================== */}

          <div className="products-heading">

            <div>

              <h2>
                Available Nuts
              </h2>

              <p>
                Showing{" "}
                {startItem}
                -
                {endItem}{" "}
                of{" "}
                {filteredProducts.length}{" "}
                products
              </p>

            </div>

          </div>


          {/* ==================================
              LOADING
          ================================== */}

          {loading && (
            <div className="products-message">
              Loading nuts...
            </div>
          )}


          {/* ==================================
              ERROR
          ================================== */}

          {!loading && error && (
            <div className="products-message error-message">
              {error}
            </div>
          )}


          {/* ==================================
              NO PRODUCTS
          ================================== */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (

              <div className="products-message">

                {products.length === 0
                  ? "No nuts found in the database."
                  : "No nuts found for the selected filters."}

              </div>

            )}


          {/* ==================================
              PRODUCT TABLE
          ================================== */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (

              <div className="products-table-wrapper">

                <table className="nut-products-table">

                  <thead>

                    <tr>

                      <th>
                        Product
                      </th>

                      <th>
                        Part Number
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Material
                      </th>

                      <th>
                        Grade
                      </th>

                      <th>
                        Standard
                      </th>

                      <th>
                        Size
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {paginatedProducts.map(
                      (product) => {

                        // ==================================
                        // PRODUCT STANDARDS
                        // ==================================

                        const productStandards =
                          product.standard
                            ? product.standard
                                .split(";")
                                .map(
                                  (
                                    standard
                                  ) =>
                                    standard.trim()
                                )
                                .filter(Boolean)
                            : [];


                        return (

                          <tr
                            key={product.id}
                          >

                            {/* PRODUCT */}

                            <td>

                              <strong>
                                {product.name ||
                                  "Nut Product"}
                              </strong>

                              {product.description && (
                                <small>
                                  {
                                    product.description
                                  }
                                </small>
                              )}

                            </td>


                            {/* PART NUMBER */}

                            <td>
                              {product.part_number ||
                                "-"}
                            </td>


                            {/* CATEGORY */}

                            <td>
                              {product.sub_category ||
                                "-"}
                            </td>


                            {/* MATERIAL */}

                            <td>
                              {product.material ||
                                "-"}
                            </td>


                            {/* GRADE */}

                            <td>
                              {product.grade ||
                                "-"}
                            </td>


                            {/* =================================
                                STANDARD DROPDOWN
                            ================================= */}

                            <td>

                              {productStandards.length >
                              0 ? (

                                <select
                                  className="table-standard-select"
                                  defaultValue=""
                                  onChange={(e) => {

                                    console.log(
                                      "Selected Standard:",
                                      e.target.value
                                    );

                                  }}
                                >

                                  <option
                                    value=""
                                    disabled
                                  >
                                    Select Standard
                                  </option>

                                  {productStandards.map(
                                    (
                                      standard
                                    ) => (

                                      <option
                                        key={
                                          standard
                                        }
                                        value={
                                          standard
                                        }
                                      >
                                        {standard}
                                      </option>

                                    )
                                  )}

                                </select>

                              ) : (
                                "-"
                              )}

                            </td>


                            {/* SIZE */}

                            <td>
                              {product.size ||
                                "-"}
                            </td>


                            {/* ACTION */}

                            <td>

                              <button
                                type="button"
                                className="add-btn"
                                onClick={() =>
                                  addNutToQuote(
                                    product
                                  )
                                }
                              >
                                Add to Quote
                              </button>

                            </td>

                          </tr>

                        );
                      }
                    )}

                  </tbody>

                </table>


                {/* ==================================
                    PAGINATION
                ================================== */}

                {totalPages > 1 && (

                  <div className="nut-pagination">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            page - 1
                        )
                      }
                    >
                      Previous
                    </button>


                    {/* PAGE NUMBERS */}

                    <div className="pagination-pages">

                      {Array.from(
                        {
                          length:
                            totalPages,
                        },
                        (_, index) =>
                          index + 1
                      ).map(
                        (page) => (

                          <button
                            key={page}
                            type="button"
                            className={`pagination-number ${
                              currentPage ===
                              page
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentPage(
                                page
                              )
                            }
                          >
                            {page}
                          </button>

                        )
                      )}

                    </div>


                    {/* NEXT */}

                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            page + 1
                        )
                      }
                    >
                      Next
                    </button>

                  </div>

                )}

              </div>

            )}

        </section>


        {/* ====================================
            REQUEST QUOTE
        ==================================== */}

        <section className="nut-bottom">

          <div>

            <h3>
              Need a custom requirement?
            </h3>

            <p>
              Request a quote for your
              required nuts.
            </p>

          </div>


          <div className="nut-actions">

            <Link
              to="/quote"
              className="request-btn button-link"
            >
              Request Quote
            </Link>

          </div>

        </section>

      </main>


      {/* ======================================
          FOOTER
      ====================================== */}

      <Footer />

    </div>
  );
}

export default NutDetails;
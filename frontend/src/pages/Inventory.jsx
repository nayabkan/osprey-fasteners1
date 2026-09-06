import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";


import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useQuote } from "../context/QuoteContext";

import "../styles/inventory.css";
import api from "../services/api";



function Inventory() {
  const [params, setParams] = useSearchParams();

  const {
    addItem,
    count,
  } = useQuote();

  // =========================
  // DATABASE PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================
  // FILTERS
  // =========================

  const [search, setSearch] = useState(
    params.get("search") || ""
  );

  const [category, setCategory] =
    useState("Categories");

  const [subCategory, setSubCategory] =
    useState("Sub - Categories - All");

  const [standard, setStandard] =
    useState("Standard - All");

  const [material, setMaterial] =
    useState("Material - All");

  const [size, setSize] =
    useState("Size - All");

  const [sortOrder, setSortOrder] =
    useState("default");

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(20);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/products/"
      );

      const data = response.data;

      console.log(
        "Products received from backend:",
        data
      );

      setProducts(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "PRODUCT FETCH ERROR:",
        err
      );

      setError(
        "Unable to load products from database."
      );

      setProducts([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const doSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (value) {
      setParams({
        search: value,
      });
    } else {
      setParams({});
    }

    setCurrentPage(1);
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredData = useMemo(() => {
    let result = [...products];

    const query =
      search.trim().toLowerCase();

    // =========================
    // SEARCH
    // =========================

    if (query) {
      result = result.filter((item) => {
        const searchableText = [
          item.part_number,
          item.name,
          item.description,
          item.category,
          item.sub_category,
          item.standard,
          item.material,
          item.grade,
          item.size,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          query
        );
      });
    }

    // =========================
    // CATEGORY
    // =========================

    if (category !== "Categories") {
      result = result.filter(
        (item) =>
          String(item.category || "")
            .toLowerCase() ===
          category.toLowerCase()
      );
    }

    // =========================
    // SUB CATEGORY
    // =========================

    if (
      subCategory !==
      "Sub - Categories - All"
    ) {
      result = result.filter(
        (item) =>
          String(item.sub_category || "")
            .toLowerCase() ===
          subCategory.toLowerCase()
      );
    }

    // =========================
    // STANDARD
    // =========================

    if (
      standard !== "Standard - All"
    ) {
      result = result.filter((item) =>
        String(item.standard || "")
          .toLowerCase()
          .includes(
            standard.toLowerCase()
          )
      );
    }

    // =========================
    // MATERIAL
    // =========================

    if (
      material !== "Material - All"
    ) {
      result = result.filter(
        (item) =>
          String(item.material || "")
            .toLowerCase() ===
          material.toLowerCase()
      );
    }

    // =========================
    // SIZE
    // =========================

    if (size !== "Size - All") {
      result = result.filter((item) => {
        const value = String(
          item.size || ""
        ).toLowerCase();

        return value.includes(
          size.toLowerCase()
        );
      });
    }

    // =========================
    // SORTING
    // =========================

    if (sortOrder === "part-asc") {
      result.sort((a, b) =>
        String(
          a.part_number || ""
        ).localeCompare(
          String(
            b.part_number || ""
          )
        )
      );
    }

    if (sortOrder === "part-desc") {
      result.sort((a, b) =>
        String(
          b.part_number || ""
        ).localeCompare(
          String(
            a.part_number || ""
          )
        )
      );
    }

    if (sortOrder === "quantity-asc") {
      result.sort(
        (a, b) =>
          Number(
            a.quantity_available ??
              a.quantity ??
              0
          ) -
          Number(
            b.quantity_available ??
              b.quantity ??
              0
          )
      );
    }

    if (sortOrder === "quantity-desc") {
      result.sort(
        (a, b) =>
          Number(
            b.quantity_available ??
              b.quantity ??
              0
          ) -
          Number(
            a.quantity_available ??
              a.quantity ??
              0
          )
      );
    }

    return result;

  }, [
    products,
    search,
    category,
    subCategory,
    standard,
    material,
    size,
    sortOrder,
  ]);

  // =========================
  // PAGINATION DATA
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedData =
    filteredData.slice(
      startIndex,
      endIndex
    );

  // =========================
  // ITEMS PER PAGE
  // =========================

  const handleItemsPerPage = (e) => {
    setItemsPerPage(
      Number(e.target.value)
    );

    setCurrentPage(1);
  };

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);

    setCurrentPage(1);
  };

  // =========================
  // FILTER CHANGE
  // =========================

  const handleFilterChange =
    (setter) => (e) => {
      setter(e.target.value);
      setCurrentPage(1);
    };

  // =========================
  // SORT
  // =========================

  const handleSort = () => {
    const orders = [
      "default",
      "part-asc",
      "part-desc",
      "quantity-desc",
      "quantity-asc",
    ];

    const currentIndex =
      orders.indexOf(sortOrder);

    const nextIndex =
      (currentIndex + 1) %
      orders.length;

    setSortOrder(
      orders[nextIndex]
    );

    setCurrentPage(1);
  };

  // =========================
  // ADD TO QUOTE
  // =========================

  const handleAddToQuote = (item) => {
    const quantity =
      Number(
        item.quantity_available ??
          item.quantity ??
          0
      );

    const quoteItem = {
      id: item.id,

      productId: item.id,

      name:
        item.name ||
        item.description ||
        item.part_number,

      product_name:
        item.name ||
        item.description ||
        item.part_number,

      partNumber:
        item.part_number,

      part_number:
        item.part_number,

      description:
        item.description ||
        item.name ||
        "",

      category:
        item.category || "",

      sub_category:
        item.sub_category || "",

      material:
        item.material || "",

      grade:
        item.grade || "",

      standard:
        item.standard || "",

      size:
        item.size || "",

      qty: quantity,

      quantity_available:
        quantity,
    };

    console.log(
      "Adding product to quote:",
      quoteItem
    );

    addItem(
      quoteItem,
      1
    );
  };

  // =========================
  // PAGE BUTTONS
  // =========================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="inventory-page-wrap">

      <Navbar />

      <main className="inventory-page">

        <h1>Inventory</h1>

        {/* =========================
            CONTROLS
        ========================= */}

        <section className="inventory-controls">

          <form
            className="search-row"
            onSubmit={doSearch}
          >

            <select
              value={category}
              onChange={
                handleCategoryChange
              }
            >
              <option>
                Categories
              </option>

              <option>
                Nuts
              </option>

              <option>
                Bolts
              </option>

              <option>
                Screws
              </option>

              <option>
                Studs
              </option>

              <option>
                Set Screws
              </option>

              <option>
                Custom Solution
              </option>
            </select>


            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search by part no, material, size..."
            />


            <button
              type="submit"
              className="search-submit"
              aria-label="Search"
            >
              <span className="search-icon light" />
            </button>


            <Link
              to="/quote"
              className="review-quote"
            >
              Review Quote

              {count > 0 && (
                <span className="quote-count">
                  {count}
                </span>
              )}
            </Link>

          </form>


          {/* =========================
              FILTER ROW
          ========================= */}

          <div className="filter-row">

            <select
              value={subCategory}
              onChange={
                handleFilterChange(
                  setSubCategory
                )
              }
            >
              <option>
                Sub - Categories - All
              </option>

              <option>
                Hex
              </option>

              <option>
                Heavy Hex
              </option>

              <option>
                Locking
              </option>
            </select>


            <select
              value={standard}
              onChange={
                handleFilterChange(
                  setStandard
                )
              }
            >
              <option>
                Standard - All
              </option>

              <option>
                ASTM
              </option>

              <option>
                MIL-SPEC
              </option>
            </select>


            <select
              value={material}
              onChange={
                handleFilterChange(
                  setMaterial
                )
              }
            >
              <option>
                Material - All
              </option>

              <option>
                Alloy Steel
              </option>

              <option>
                Stainless Steel
              </option>

              <option>
                Brass
              </option>

              <option>
                Titanium
              </option>

              <option>
                Nickel Alloys
              </option>
            </select>


            <select
              value={size}
              onChange={
                handleFilterChange(
                  setSize
                )
              }
            >
              <option>
                Size - All
              </option>

              <option>
                Small
              </option>

              <option>
                Medium
              </option>

              <option>
                Large
              </option>
            </select>


            <button
              type="button"
              className="sort-button"
              onClick={handleSort}
            >
              Sort ⇅
            </button>

          </div>

        </section>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="inventory-loading">
            Loading products...
          </div>
        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="inventory-error">

            {error}

            <button
              type="button"
              onClick={fetchProducts}
            >
              Retry
            </button>

          </div>
        )}


        {/* =========================
            TABLE
        ========================= */}

        {!loading &&
          !error && (

            <section className="inventory-table-section">

              <table className="inventory-table">

                <thead>

                  <tr>

                    <th></th>

                    <th>
                      Part Number
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Qty Avl
                    </th>

                    <th></th>

                  </tr>

                </thead>


                <tbody>

                  {paginatedData.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan="5"
                        className="no-products"
                      >
                        No products found.
                      </td>

                    </tr>
                  )}


                  {paginatedData.map(
                    (item, index) => {

                      const availableQty =
                        Number(
                          item.quantity_available ??
                            item.quantity ??
                            0
                        );

                      return (

                        <tr
                          key={
                            item.id ??
                            item.part_number ??
                            index
                          }
                        >

                          {/* NUMBER */}

                          <td className="row-number">

                            {startIndex +
                              index +
                              1}

                          </td>


                          {/* PART NUMBER */}

                          <td className="part-number-cell">

                            <span
                              className="inventory-part-number"
                              title={
                                item.part_number ||
                                ""
                              }
                            >
                              {item.part_number ||
                                "-"}
                            </span>

                          </td>


                          {/* DESCRIPTION */}

                          <td className="description-cell">

                            <span
                              className="inventory-description"
                              title={
                                item.description ||
                                item.name ||
                                ""
                              }
                            >
                              {item.description ||
                                item.name ||
                                "-"}
                            </span>

                          </td>


                          {/* QUANTITY */}

                          <td className="quantity-cell">

                            {availableQty}

                          </td>


                          {/* ADD TO QUOTE */}

                          <td className="action-cell">

                            <button
                              type="button"
                              className="add-quote"
                              onClick={() =>
                                handleAddToQuote(
                                  item
                                )
                              }
                            >

                              <span>
                                ＋
                              </span>

                              Add to Quote

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </section>
          )}


        {/* =========================
            PAGINATION
        ========================= */}

        {!loading &&
          !error &&
          filteredData.length > 0 && (

            <section className="pagination-section">

              <select
                className="items-per-page"
                value={itemsPerPage}
                onChange={
                  handleItemsPerPage
                }
              >

                <option value="20">
                  20 items per page
                </option>

                <option value="40">
                  40 items per page
                </option>

                <option value="60">
                  60 items per page
                </option>

              </select>


              <div className="pagination">

                <button
                  type="button"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    goToPage(
                      safeCurrentPage - 1
                    )
                  }
                >
                  ‹ Previous
                </button>


                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                )
                  .slice(0, 5)
                  .map((page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage ===
                        page
                          ? "active-page"
                          : ""
                      }
                      onClick={() =>
                        goToPage(page)
                      }
                    >
                      {page}
                    </button>

                  ))}


                {totalPages > 5 && (
                  <>

                    <span>
                      ...
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        goToPage(
                          totalPages
                        )
                      }
                    >
                      {totalPages}
                    </button>

                  </>
                )}


                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    goToPage(
                      safeCurrentPage + 1
                    )
                  }
                >
                  Next ›
                </button>

              </div>

            </section>
          )}


        {/* =========================
            BOTTOM ACTIONS
        ========================= */}

        <div className="inventory-bottom-actions">

          <Link
            to="/quote"
            className="inventory-request-btn"
          >
            Request Quote
          </Link>


          <Link
            to="/quote"
            className="inventory-add-btn"
          >
            Add to Quote
          </Link>

        </div>

      </main>


      <Footer />

    </div>
  );
}

export default Inventory;
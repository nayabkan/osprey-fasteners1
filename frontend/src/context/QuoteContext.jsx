import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import api from "../services/api";

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // =========================================================
  // LOAD QUOTE ITEMS
  // =========================================================

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      if (!token) {
        return;
      }

      const response = await api.get("/quotes/", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      const formatted = data

        // Request Quote ke submitted records ko
        // cart/quote items me show nahi karna
        .filter((item) => !item.request_id)

        .map((item) => ({
          key: String(item.id),

          id: item.id,

          productId: item.product_id,

          partNumber: item.part_number,

          product_name: item.product_name,

          name:
            item.product_name ||
            item.part_number,

          description:
            item.product_name || "",

          quantity: item.quantity,

          quoteId: item.id,
        }));

      setItems(formatted);

    } catch (error) {
      console.error(
        "GET QUOTES ERROR:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        console.error(
          "User is not authorized to load quotes"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD QUOTES ONLY FOR ADMIN
  // =========================================================

  useEffect(() => {
    if (user?.is_admin) {
      fetchQuotes();
    }
  }, [user?.is_admin]);

  // =========================================================
  // ADD PRODUCT TO QUOTE
  // POST /quotes/
  // =========================================================

  const addItem = async (
    item,
    quantity = 1
  ) => {
    try {
      const qty = Math.max(
        1,
        Number(quantity) || 1
      );

      const productId = Number(
        item.id ||
        item.productId ||
        item.product_id
      );

      const partNumber =
        item.partNumber ||
        item.part_number ||
        "";

      const productName =
        item.name ||
        item.product_name ||
        item.description ||
        partNumber;

      // -----------------------------------------------------
      // VALIDATE PRODUCT ID
      // -----------------------------------------------------

      if (!productId) {
        console.error(
          "Product ID missing:",
          item
        );

        alert("Product ID missing");

        return false;
      }

      // -----------------------------------------------------
      // VALIDATE PART NUMBER
      // -----------------------------------------------------

      if (!partNumber) {
        console.error(
          "Part number missing:",
          item
        );

        alert("Part number missing");

        return false;
      }

      // -----------------------------------------------------
      // PAYLOAD
      // -----------------------------------------------------

      const payload = {
        product_id: productId,

        part_number: partNumber,

        product_name: productName,

        quantity: qty,
      };

      console.log(
        "ADDING PRODUCT TO QUOTE:",
        payload
      );

      // -----------------------------------------------------
      // POST REQUEST
      // -----------------------------------------------------

      const response = await api.post(
        "/quotes/",
        payload,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = response.data;

      console.log(
        "ADD TO QUOTE RESPONSE:",
        data
      );

      // -----------------------------------------------------
      // FORMAT ITEM
      // -----------------------------------------------------

      const formattedItem = {
        key: String(data.id),

        id: data.id,

        productId: data.product_id,

        partNumber: data.part_number,

        product_name: data.product_name,

        name:
          data.product_name ||
          data.part_number,

        description:
          data.product_name || "",

        quantity: data.quantity,

        quoteId: data.id,
      };

      // -----------------------------------------------------
      // UPDATE LOCAL STATE
      // -----------------------------------------------------

      setItems((current) => {
        const exists = current.find(
          (x) =>
            x.productId === data.product_id &&
            !x.requestId
        );

        if (exists) {
          return current.map((x) =>
            x.productId === data.product_id
              ? {
                  ...x,

                  quantity: data.quantity,

                  quoteId: data.id,

                  key: String(data.id),

                  id: data.id,
                }
              : x
          );
        }

        return [
          ...current,
          formattedItem,
        ];
      });

      return true;

    } catch (error) {
      console.error(
        "ADD TO QUOTE ERROR:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to connect with backend"
      );

      return false;
    }
  };

  // =========================================================
  // REQUEST QUOTE
  // POST /quotes/request
  // =========================================================

  const submitQuoteRequest = async (
    formData
  ) => {
    try {
      if (!items.length) {
        throw new Error(
          "Please add at least one part to the quote"
        );
      }

      // ---------------------------------------------------
      // TOKEN
      // ---------------------------------------------------

      const token =
        localStorage.getItem(
          "access_token"
        );

      if (!token) {
        throw new Error(
          "Please login before submitting a quote request"
        );
      }

      // ---------------------------------------------------
      // REQUEST ITEMS
      // ---------------------------------------------------

      const requestItems = items.map(
        (item) => ({
          product_id:
            Number(item.productId) || 0,

          part_number:
            item.partNumber || "",

          product_name:
            item.product_name ||
            item.name ||
            "",

          quantity: Math.max(
            1,
            Number(item.quantity) || 1
          ),
        })
      );

      // ---------------------------------------------------
      // PAYLOAD
      // ---------------------------------------------------

      const payload = {
        company_name:
          formData.companyName,

        contact_person:
          formData.contactPerson,

        email:
          formData.email,

        phone:
          formData.phone,

        address:
          formData.address || null,

        message:
          formData.message || null,

        items: requestItems,
      };

      console.log(
        "SUBMIT QUOTE REQUEST:",
        payload
      );

      // ---------------------------------------------------
      // REQUEST
      // ---------------------------------------------------

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
        "QUOTE REQUEST RESPONSE:",
        data
      );

      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------

      setItems([]);

      return {
        success: true,
        data: data,
      };

    } catch (error) {
      console.error(
        "SUBMIT QUOTE REQUEST ERROR:",
        error
      );

      return {
        success: false,

        error:
          error.response?.data?.detail ||
          error.message ||
          "Unable to submit quote request",
      };
    }
  };

  // =========================================================
  // UPDATE QUANTITY
  // PUT /quotes/{id}
  // =========================================================

  const updateQuantity = async (
    key,
    quantity
  ) => {
    try {
      const qty = Math.max(
        1,
        Number(quantity) || 1
      );

      const item = items.find(
        (x) =>
          String(x.key) ===
          String(key)
      );

      if (!item) {
        console.error(
          "Quote item not found:",
          key
        );

        return false;
      }

      const quoteId =
        item.quoteId ||
        item.id;

      // ---------------------------------------------------
      // UPDATE REQUEST
      // ---------------------------------------------------

      const response = await api.put(
        `/quotes/${quoteId}?quantity=${qty}`,
        null,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = response.data;

      // ---------------------------------------------------
      // UPDATE LOCAL STATE
      // ---------------------------------------------------

      setItems((current) =>
        current.map((x) =>
          x.quoteId === quoteId
            ? {
                ...x,

                quantity:
                  data.quantity,
              }
            : x
        )
      );

      return true;

    } catch (error) {
      console.error(
        "UPDATE QUANTITY ERROR:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to update quantity"
      );

      return false;
    }
  };

  // =========================================================
  // REMOVE ITEM
  // DELETE /quotes/{id}
  // =========================================================

  const removeItem = async (key) => {
    try {
      const item = items.find(
        (x) =>
          String(x.key) ===
          String(key)
      );

      if (!item) {
        return false;
      }

      const quoteId =
        item.quoteId ||
        item.id;

      // ---------------------------------------------------
      // DELETE REQUEST
      // ---------------------------------------------------

      const response =
        await api.delete(
          `/quotes/${quoteId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

      const data = response.data;

      // ---------------------------------------------------
      // REMOVE LOCAL ITEM
      // ---------------------------------------------------

      setItems((current) =>
        current.filter(
          (x) =>
            x.quoteId !== quoteId
        )
      );

      return true;

    } catch (error) {
      console.error(
        "REMOVE QUOTE ERROR:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to remove quote item"
      );

      return false;
    }
  };

  // =========================================================
  // CLEAR ALL QUOTE ITEMS
  // =========================================================

  const clearItems = async () => {
    try {
      const deleteRequests =
        items.map((item) =>
          api.delete(
            `/quotes/${item.quoteId}`,
            {
              headers: {
                Accept:
                  "application/json",
              },
            }
          )
        );

      await Promise.all(
        deleteRequests
      );

      setItems([]);

      return true;

    } catch (error) {
      console.error(
        "CLEAR QUOTE ERROR:",
        error
      );

      return false;
    }
  };

  // =========================================================
  // COUNT
  // =========================================================

  const count = items.length;

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = useMemo(
    () => ({
      items,

      count,

      loading,

      addItem,

      submitQuoteRequest,

      updateQuantity,

      removeItem,

      clearItems,

      fetchQuotes,
    }),
    [
      items,
      count,
      loading,
    ]
  );

  return (
    <QuoteContext.Provider
      value={value}
    >
      {children}
    </QuoteContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useQuote() {
  const context =
    useContext(
      QuoteContext
    );

  if (!context) {
    throw new Error(
      "useQuote must be used inside QuoteProvider"
    );
  }

  return context;
}
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StockMovement from "./pages/StockMovement.jsx";
import Products from "./pages/Products.jsx";
import Transactions from "./pages/Transactions.jsx";
import LabourManagement from "./pages/LabourManagement.jsx";

import "./App.css";

const API_URL = "http://localhost:8080";

// =========================
// QR SCANNER
// =========================

function QRScanner({ onScan }) {
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false,
    );

    let alreadyScanned = false;

    const handleScan = (decodedText) => {
      if (alreadyScanned) return;

      alreadyScanned = true;

      onScanRef.current(decodedText);

      scanner.clear().catch(() => {});
    };

    const handleError = () => {
      // Ignore scanner errors
    };

    scanner.render(handleScan, handleError);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return <div id="qr-reader"></div>;
}

// =========================
// MAIN APP
// =========================

function App() {
  const navigate = useNavigate();

  // =========================
  // USER
  // =========================

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingProductId, setEditingProductId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [productForm, setProductForm] = useState({
    productCode: "",
    productName: "",
    category: "",
    price: "",
    currentStock: "",
    qrCode: "",
  });

  // =========================
  // TRANSACTIONS
  // =========================

  const [transactions, setTransactions] = useState([]);

  // =========================
  // STOCK
  // =========================

  const [showScanner, setShowScanner] = useState(false);

  const [stockMessage, setStockMessage] = useState("");

  const [stockMode, setStockMode] = useState(null);

  const [stockForm, setStockForm] = useState({
    qrCode: "",
    quantity: "",
  });

  // =========================
  // LOAD DATA
  // =========================

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Products loading error:", error);
    }
  };



const loadTransactions = async () => {
  try {
    const response = await fetch(`${API_URL}/api/stock/history`);

    if (!response.ok) {
      throw new Error("Failed to load transactions");
    }

    const data = await response.json();

    setTransactions(data);
  } catch (error) {
    console.error("Transactions loading error:", error);
  }
};



  useEffect(() => {
    if (!user) return;

    loadProducts();
    loadTransactions();
  }, [user]);

  // =========================
  // PRODUCT FORM
  // =========================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setProductForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...productForm,

          price: Number(productForm.price),

          currentStock: Number(productForm.currentStock),
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();

        setProducts((previousProducts) => [...previousProducts, newProduct]);

        setProductForm({
          productCode: "",
          productName: "",
          category: "",
          price: "",
          currentStock: "",
          qrCode: "",
        });

        setShowForm(false);

        alert("Product added successfully!");
      } else {
        const message = await response.text();

        alert(message || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);

      alert("Unable to connect to server.");
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setProductForm({
      productCode: product.productCode,
      productName: product.productName,
      category: product.category,
      price: product.price,
      currentStock: product.currentStock,
      qrCode: product.qrCode,
    });

    setShowForm(true);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdateProduct = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/products/${editingProductId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...productForm,

            price: Number(productForm.price),

            currentStock: Number(productForm.currentStock),
          }),
        },
      );

      if (response.ok) {
        const updatedProduct = await response.json();

        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product,
          ),
        );

        setProductForm({
          productCode: "",
          productName: "",
          category: "",
          price: "",
          currentStock: "",
          qrCode: "",
        });

        setEditingProductId(null);

        setShowForm(false);

        alert("Product updated successfully!");
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error(error);

      alert("Unable to connect to server.");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((previousProducts) =>
          previousProducts.filter((product) => product.id !== id),
        );

        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error(error);

      alert("Unable to connect to server.");
    }
  };

  // =========================
  // STOCK FORM
  // =========================

  const handleStockChange = (event) => {
    const { name, value } = event.target;

    setStockForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =========================
  // STOCK IN / OUT
  // =========================

  const handleStockMovement = async (type, scannedQrCode = null) => {
    const qrCodeToUse = scannedQrCode || stockForm.qrCode;

    const quantityToUse = scannedQrCode ? 1 : Number(stockForm.quantity);

    if (!qrCodeToUse) {
      setStockMessage("Please scan or enter QR Code.");

      return;
    }

    if (!quantityToUse || quantityToUse <= 0) {
      setStockMessage("Invalid quantity.");

      return;
    }

    try {

const response = await fetch(`${API_URL}/api/stock/${type}`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    qrCode: qrCodeToUse,
    quantity: quantityToUse,
  }),
});


      if (response.ok) {
        await response.json();

        setShowScanner(false);

        setStockMessage(
          `Stock ${type.toUpperCase()} successful! ${qrCodeToUse} ${
            type === "in" ? "+" : "-"
          }${quantityToUse}`,
        );

        setStockForm({
          qrCode: "",
          quantity: "",
        });

        await loadProducts();

        await loadTransactions();
      } else {
        const errorData = await response.json().catch(() => null);

        setStockMessage(errorData?.message || "Stock operation failed.");
      }
    } catch (error) {
      console.error(error);

      setStockMessage("Unable to connect to server.");
    }
  };

  // =========================
  // CREATE LABOUR
  // =========================

  const handleCreateLabour = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = formData.get("name");

    const username = formData.get("username");

    const password = formData.get("password");

    if (!name || !username || !password) {
      alert("Please fill all Labour details.");

      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });

      if (response.ok) {
        alert("Labour account created successfully!");

        event.target.reset();
      } else {
        const errorMessage = await response.text();

        alert(errorMessage || "Failed to create Labour account.");
      }
    } catch (error) {
      console.error(error);

      alert("Unable to connect to server.");
    }
  };

  // =========================
  // LOGOUT
  // =========================

const handleLogout = async () => {
  try {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    setUser(null);
    setProducts([]);
    setTransactions([]);
    setShowScanner(false);
    setStockMode(null);
    setStockMessage("");
    navigate("/login", { replace: true });
  }
};

  // =========================
  // LOGIN
  // =========================

  if (!user) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={(loggedInUser) => {
                setUser(loggedInUser);

                if (loggedInUser.role === "ADMIN") {
                  navigate("/dashboard");
                } else {
                  navigate("/stock");
                }
              }}
            />
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // =========================
  // APPLICATION
  // =========================

  return (
    <div className="app">
      {/* HEADER */}

      {/* HEADER */}
<nav className="navbar navbar-expand-lg app-navbar sticky-top">
  <div className="container-fluid px-3 px-lg-4">
    <Link
      to={user.role === "ADMIN" ? "/dashboard" : "/stock"}
      className="navbar-brand app-brand"
      onClick={() => setMenuOpen(false)}
    >
      <span className="brand-icon">🍦</span>
      <span>Ice Cream Godown</span>
    </Link>

    <button
      className="navbar-toggler app-menu-toggle"
      type="button"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-controls="mainNavbar"
      aria-expanded={menuOpen}
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div
      className={`collapse navbar-collapse ${
        menuOpen ? "show" : ""
      }`}
      id="mainNavbar"
    >
      <ul className="navbar-nav me-auto app-nav-links">
        {user.role === "ADMIN" && (
          <>
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link app-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link app-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `nav-link app-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Transactions
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/labours"
                className={({ isActive }) =>
                  `nav-link app-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Labour Management
              </NavLink>
            </li>
          </>
        )}

        <li className="nav-item">
          <NavLink
            to="/stock"
            className={({ isActive }) =>
              `nav-link app-nav-link ${
                isActive ? "active" : ""
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Stock Movement
          </NavLink>
        </li>
      </ul>

      <div className="app-user-section">
        <div className="app-user-info">
          <span className="app-user-name">{user.name}</span>
          <span className="app-user-role">{user.role}</span>
        </div>

        <button
          onClick={() => {
            setMenuOpen(false);
            handleLogout();
          }}
          className="btn app-logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>

      {/* ROUTES */}

      <div className="dashboard">
        <Routes>
          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={
              user.role === "ADMIN" ? (
                <Dashboard products={products} transactions={transactions} />
              ) : (
                <Navigate to="/stock" replace />
              )
            }
          />

          {/* STOCK */}

          <Route
            path="/stock"
            element={
              <StockMovement
                stockMode={stockMode}
                setStockMode={setStockMode}
                stockMessage={stockMessage}
                setStockMessage={setStockMessage}
                showScanner={showScanner}
                setShowScanner={setShowScanner}
                handleStockMovement={handleStockMovement}
                QRScanner={QRScanner}
              />
            }
          />

          {/* PRODUCTS */}

          <Route
            path="/products"
            element={
              user.role === "ADMIN" ? (
                <Products
                  user={user}
                  products={products}
                  productForm={productForm}
                  setProductForm={setProductForm}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  editingProductId={editingProductId}
                  setEditingProductId={setEditingProductId}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleInputChange={handleInputChange}
                  handleAddProduct={handleAddProduct}
                  handleUpdateProduct={handleUpdateProduct}
                  handleEditProduct={handleEditProduct}
                  handleDeleteProduct={handleDeleteProduct}
                />
              ) : (
                <Navigate to="/stock" replace />
              )
            }
          />

          {/* TRANSACTIONS */}

          <Route
            path="/transactions"
            element={
              user.role === "ADMIN" ? (
                <Transactions user={user} transactions={transactions} />
              ) : (
                <Navigate to="/stock" replace />
              )
            }
          />

          {/* LABOUR MANAGEMENT */}

          <Route
            path="/labours"
            element={
              user.role === "ADMIN" ? (
                <LabourManagement
                  user={user}
                  handleCreateLabour={handleCreateLabour}
                />
              ) : (
                <Navigate to="/stock" replace />
              )
            }
          />

          {/* DEFAULT */}

          <Route
            path="*"
            element={
              <Navigate
                to={user.role === "ADMIN" ? "/dashboard" : "/stock"}
                replace
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

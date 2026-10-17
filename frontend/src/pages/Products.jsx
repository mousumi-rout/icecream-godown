function Products({
  user,
  products,
  productForm,
  setProductForm,
  showForm,
  setShowForm,
  editingProductId,
  setEditingProductId,
  searchTerm,
  setSearchTerm,
  handleInputChange,
  handleAddProduct,
  handleUpdateProduct,
  handleEditProduct,
  handleDeleteProduct,
}) {
  if (user?.role !== "ADMIN") {
    return null;
  }

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();

    return (
      (product.productName || "").toLowerCase().includes(term) ||
      (product.productCode || "").toLowerCase().includes(term) ||
      (product.category || "").toLowerCase().includes(term) ||
      (product.qrCode || "").toLowerCase().includes(term)
    );
  });

  const resetForm = () => {
    setEditingProductId(null);
    setProductForm({
      productCode: "",
      productName: "",
      category: "",
      price: "",
      currentStock: "",
      qrCode: "",
    });
    setShowForm(false);
  };

  return (
    <div className="products-section container-fluid py-4">
      {/* Centered Page Heading */}
      <div className="products-heading">
        <div className="products-heading-text">
          <h2 className="fw-bold mb-2">📦 Products</h2>
          <p>Manage your ice cream inventory</p>
        </div>

        <button
          type="button"
          className={`btn products-add-btn ${
            showForm ? "btn-outline-secondary" : "btn-primary"
          }`}
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingProductId(null);
              setProductForm({
                productCode: "",
                productName: "",
                category: "",
                price: "",
                currentStock: "",
                qrCode: "",
              });
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✖ Close Form" : "＋ Add Product"}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="fw-bold mb-0">
              {editingProductId ? "✏️ Edit Product" : "➕ Add New Product"}
            </h5>
          </div>

          <div className="card-body p-3 p-md-4">
            <form
              onSubmit={
                editingProductId ? handleUpdateProduct : handleAddProduct
              }
            >
              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label">Product Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productCode"
                    placeholder="e.g. ICE001"
                    value={productForm.productCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    placeholder="Enter product name"
                    value={productForm.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    placeholder="e.g. Cup, Cone"
                    value={productForm.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label">
                    {editingProductId ? "Current Stock" : "Initial Stock"}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="currentStock"
                    placeholder="Enter stock quantity"
                    min="0"
                    value={productForm.currentStock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label">QR Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="qrCode"
                    placeholder="Enter QR code value"
                    value={productForm.qrCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                <button type="submit" className="btn btn-primary">
                  {editingProductId ? "💾 Update Product" : "＋ Save Product"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Count */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center mb-4">
            <div className="col-12 col-md-8">
              <label htmlFor="productSearch" className="form-label fw-semibold">
                Search Products
              </label>

              <input
                id="productSearch"
                type="search"
                className="form-control"
                placeholder="🔍 Search name, code, category or QR..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="col-12 col-md-4 text-md-end">
              <span className="badge text-bg-primary fs-6 mt-md-4">
                {filteredProducts.length} Products
              </span>
            </div>
          </div>

          {/* Desktop and Tablet Table */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>QR Code</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="text-nowrap">{product.productCode}</td>
                    <td className="fw-semibold">{product.productName}</td>
                    <td>{product.category}</td>
                    <td className="text-nowrap">
                      ₹{Number(product.price).toFixed(2)}
                    </td>
                    <td>
                      <span className="badge text-bg-light border">
                        {product.currentStock}
                      </span>
                    </td>
                    <td>{product.qrCode}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Product Cards */}
          <div className="d-md-none">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-muted py-5">
                No products found.
              </div>
            ) : (
              <div className="row g-3">
                {filteredProducts.map((product) => (
                  <div className="col-12" key={product.id}>
                    <div className="card border shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                          <h5 className="fw-bold mb-0">
                            {product.productName}
                          </h5>
                          <span className="badge text-bg-secondary">
                            #{product.id}
                          </span>
                        </div>

                        <hr />

                        <div className="mb-2">
                          <span className="text-muted">Product Code:</span>{" "}
                          <strong>{product.productCode}</strong>
                        </div>

                        <div className="mb-2">
                          <span className="text-muted">Category:</span>{" "}
                          {product.category}
                        </div>

                        <div className="mb-2">
                          <span className="text-muted">Price:</span>{" "}
                          <strong>₹{Number(product.price).toFixed(2)}</strong>
                        </div>

                        <div className="mb-2">
                          <span className="text-muted">Current Stock:</span>{" "}
                          <span className="badge text-bg-success">
                            {product.currentStock}
                          </span>
                        </div>

                        <div className="mb-3">
                          <span className="text-muted">QR Code:</span>{" "}
                          {product.qrCode}
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary flex-fill"
                            onClick={() => handleEditProduct(product)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger flex-fill"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

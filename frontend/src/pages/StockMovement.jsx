function StockMovement({
  stockMode,
  setStockMode,
  stockMessage,
  setStockMessage,
  showScanner,
  setShowScanner,
  handleStockMovement,
  QRScanner,
}) {
  const selectMode = (mode) => {
    setStockMode(mode);
    setStockMessage(
      `Stock ${mode.toUpperCase()} selected. Please scan the product QR code.`,
    );
    setShowScanner(true);
  };

  const isSuccess = stockMessage.toLowerCase().includes("successful");

  const isError = ["failed", "invalid", "unable", "not found"].some((message) =>
    stockMessage.toLowerCase().includes(message),
  );

  return (
    <main className="stock-page">
      {/* Page Heading */}
      <header className="stock-heading">
        <span className="stock-eyebrow">INVENTORY MANAGEMENT</span>
        <h1>📦 Stock Movement</h1>
        <p>Scan a product QR code to update inventory.</p>
      </header>

      {/* Main Stock Card */}
      <section className="stock-main-card">
        <div className="stock-card-heading">
          <h2>Manage Inventory</h2>
          <p>Choose a stock operation to get started.</p>
        </div>

        <div className="stock-mode-grid">
          {/* Stock IN */}
          <button
            type="button"
            className={`stock-mode-button stock-in-button ${
              stockMode === "in" ? "selected" : ""
            }`}
            onClick={() => selectMode("in")}
          >
            <span className="stock-mode-icon">📥</span>
            <span className="stock-mode-title">Stock IN</span>
            <span className="stock-mode-description">Add inventory</span>
          </button>

          {/* Stock OUT */}
          <button
            type="button"
            className={`stock-mode-button stock-out-button ${
              stockMode === "out" ? "selected" : ""
            }`}
            onClick={() => selectMode("out")}
          >
            <span className="stock-mode-icon">📤</span>
            <span className="stock-mode-title">Stock OUT</span>
            <span className="stock-mode-description">Remove inventory</span>
          </button>
        </div>

        {/* Scanner Controls */}
        <div className="stock-scanner-controls">
          {!showScanner && (
            <button
              type="button"
              className="stock-open-scanner"
              onClick={() => {
                if (!stockMode) {
                  setStockMessage("Please select Stock IN or Stock OUT first.");
                  return;
                }

                setShowScanner(true);
                setStockMessage("Camera ready. Scan the product QR code.");
              }}
            >
              <span>📷</span> Open QR Scanner
            </button>
          )}

          {showScanner && (
            <button
              type="button"
              className="stock-close-scanner"
              onClick={() => setShowScanner(false)}
            >
              ✖ Close Scanner
            </button>
          )}
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div className="stock-scanner-area">
            <div
              className={`stock-scanner-instructions ${
                stockMode === "in" ? "instruction-in" : "instruction-out"
              }`}
            >
              {stockMode === "in"
                ? "📥 Scan to add 1 unit to stock"
                : "📤 Scan to remove 1 unit from stock"}
            </div>

            <div className="stock-scanner-frame">
              <QRScanner
                onScan={(decodedText) => {
                  if (!stockMode) {
                    setStockMessage(
                      "Please select Stock IN or Stock OUT first.",
                    );
                    setShowScanner(false);
                    return;
                  }

                  setShowScanner(false);
                  handleStockMovement(stockMode, decodedText);
                }}
              />
            </div>
          </div>
        )}

        {/* Status Message */}
        {stockMessage && (
          <div
            className={`stock-status-message ${
              isSuccess
                ? "status-success"
                : isError
                  ? "status-error"
                  : "status-info"
            }`}
            role="status"
          >
            <span>{isSuccess ? "✅" : isError ? "⚠️" : "ℹ️"}</span>
            <span>{stockMessage}</span>
          </div>
        )}
      </section>

      {/* Instructions */}
      <section className="stock-help-card">
        <div className="stock-help-icon">💡</div>
        <div>
          <h2>How it works</h2>
          <p>
            Select Stock IN to receive a unit or Stock OUT to dispatch a unit.
            Open the scanner and scan the corresponding product QR code to
            record the movement.
          </p>
        </div>
      </section>
    </main>
  );
}

export default StockMovement;

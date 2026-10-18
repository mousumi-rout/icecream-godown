function Transactions({ user, transactions = [] }) {
  if (user?.role !== "ADMIN") {
    return null;
  }

  const formatDate = (dateTime) => {
    if (!dateTime) return "-";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-IN");
  };

  const stockInCount = transactions.filter(
    (transaction) => transaction.transactionType === "IN",
  ).length;

  const stockOutCount = transactions.filter(
    (transaction) => transaction.transactionType === "OUT",
  ).length;

  const summaryCards = [
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: "📋",
      color: "blue",
      description: "All stock movements",
    },
    {
      title: "Stock IN",
      value: stockInCount,
      icon: "📥",
      color: "green",
      description: "Receiving records",
    },
    {
      title: "Stock OUT",
      value: stockOutCount,
      icon: "📤",
      color: "orange",
      description: "Dispatch records",
    },
  ];

  const sortedTransactions = [...transactions].reverse();

  return (
    <main className="transactions-section">
      <header className="transactions-heading">
        <span className="transactions-eyebrow">INVENTORY MANAGEMENT</span>

        <h1>📋 Transaction History</h1>

        <p>Track stock IN and stock OUT activity.</p>
      </header>

      {/* Summary Cards */}
      <section className="transactions-summary">
        {summaryCards.map((card) => (
          <article
            className={`transactions-summary-card ${card.color}`}
            key={card.title}
          >
            <div className="transactions-summary-top">
              <div className="transactions-summary-icon">{card.icon}</div>

              <span>{card.title}</span>
            </div>

            <div className="transactions-summary-value">
              {card.value.toLocaleString("en-IN")}
            </div>

            <p>{card.description}</p>
          </article>
        ))}
      </section>

      {/* Transaction Table */}
      <section className="transactions-table-card">
        <div className="transactions-table-heading">
          <div>
            <h2>All Transactions</h2>
            <p>Complete history of inventory movements</p>
          </div>

          <span className="transactions-count">
            {transactions.length} Records
          </span>
        </div>

        {/* Desktop Table */}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0 transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Performed By</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Previous Stock</th>
                <th>New Stock</th>
                <th>Date &amp; Time</th>
              </tr>
            </thead>

            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="transaction-id">#{transaction.id}</td>

                  <td className="transaction-product">
                    {transaction.product?.productName || "Unknown Product"}
                  </td>

                  <td className="transaction-performer">
                    {transaction.performedBy?.name || "Not recorded"}

                    {transaction.performedBy?.role && (
                      <small> ({transaction.performedBy.role})</small>
                    )}
                  </td>

                  <td>
                    <span
                      className={`transaction-type ${
                        transaction.transactionType === "IN"
                          ? "stock-in"
                          : "stock-out"
                      }`}
                    >
                      {transaction.transactionType === "IN"
                        ? "📥 Stock IN"
                        : "📤 Stock OUT"}
                    </span>
                  </td>

                  <td className="transaction-quantity">
                    {Number(transaction.quantity).toLocaleString("en-IN")}
                  </td>

                  <td>
                    {Number(transaction.previousStock).toLocaleString("en-IN")}
                  </td>

                  <td className="transaction-new-stock">
                    {Number(transaction.newStock).toLocaleString("en-IN")}
                  </td>

                  <td className="transaction-date">
                    {formatDate(transaction.transactionTime)}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No transactions available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="d-md-none transactions-mobile-list">
          {transactions.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">
              No transactions available yet.
            </p>
          ) : (
            <div className="row g-3">
              {sortedTransactions.map((transaction) => (
                <div className="col-12" key={transaction.id}>
                  <article className="transactions-mobile-card">
                    <div className="transactions-mobile-top">
                      <div>
                        <h3>
                          {transaction.product?.productName ||
                            "Unknown Product"}
                        </h3>

                        <span>Transaction #{transaction.id}</span>
                      </div>

                      <span
                        className={`transaction-type ${
                          transaction.transactionType === "IN"
                            ? "stock-in"
                            : "stock-out"
                        }`}
                      >
                        {transaction.transactionType === "IN"
                          ? "📥 IN"
                          : "📤 OUT"}
                      </span>
                    </div>

                    <div className="transactions-mobile-grid">
                      <div>
                        <span>Performed By</span>
                        <strong>
                          {transaction.performedBy?.name || "Not recorded"}
                        </strong>

                        {transaction.performedBy?.role && (
                          <small> ({transaction.performedBy.role})</small>
                        )}
                      </div>

                      <div>
                        <span>Quantity</span>
                        <strong>{transaction.quantity}</strong>
                      </div>

                      <div>
                        <span>Previous Stock</span>
                        <strong>{transaction.previousStock}</strong>
                      </div>

                      <div>
                        <span>New Stock</span>
                        <strong>{transaction.newStock}</strong>
                      </div>

                      <div className="transactions-mobile-date">
                        <span>Date &amp; Time</span>
                        <strong>
                          {formatDate(transaction.transactionTime)}
                        </strong>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Transactions;

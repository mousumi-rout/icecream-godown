function Dashboard({ products, transactions }) {
  const totalProducts = products.length;

  const currentStock = products.reduce(
    (total, product) => total + Number(product.currentStock || 0),
    0,
  );

  const totalStockIn = transactions
    .filter((transaction) => transaction.transactionType === "IN")
    .reduce(
      (total, transaction) => total + Number(transaction.quantity || 0),
      0,
    );

  const totalStockOut = transactions
    .filter((transaction) => transaction.transactionType === "OUT")
    .reduce(
      (total, transaction) => total + Number(transaction.quantity || 0),
      0,
    );

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: "📦",
      color: "blue",
      description: "Products registered",
    },
    {
      title: "Current Stock",
      value: currentStock,
      icon: "📊",
      color: "purple",
      description: "Units currently available",
    },
    {
      title: "Stock IN",
      value: totalStockIn,
      icon: "📥",
      color: "green",
      description: "Total units received",
    },
    {
      title: "Stock OUT",
      value: totalStockOut,
      icon: "📤",
      color: "orange",
      description: "Total units dispatched",
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">INVENTORY MANAGEMENT</span>
          <h1>📊 Dashboard</h1>
          <p>Welcome to your Ice Cream Godown overview.</p>
        </div>
      </section>

      <section className="dashboard-stats" aria-label="Inventory summary">
        {cards.map((card) => (
          <article
            className={`dashboard-stat-card ${card.color}`}
            key={card.title}
          >
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-icon">{card.icon}</div>
              <span className="dashboard-stat-label">{card.title}</span>
            </div>

            <div className="dashboard-stat-value">
              {card.value.toLocaleString("en-IN")}
            </div>

            <p className="dashboard-stat-description">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-note">
        <div className="dashboard-note-icon">💡</div>
        <div>
          <h2>Inventory at a glance</h2>
          <p>
            Current Stock shows the combined available stock of all products.
            Stock IN and Stock OUT show the total quantities recorded in
            transaction history.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

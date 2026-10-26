import { useMemo, useState } from "react";
import "./Dashboard.css";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTransactionDate = (transaction) => {
  const value =
    transaction.transactionTime ??
    transaction.transaction_time ??
    transaction.transactionDate ??
    transaction.createdAt ??
    transaction.date ??
    transaction.timestamp;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : formatDate(date);
};

const getInitialDates = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  return {
    start: formatDate(start),
    end: formatDate(today),
  };
};

function Dashboard({ products = [], transactions = [] }) {
  const initialDates = useMemo(() => getInitialDates(), []);

  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [selectedDate, setSelectedDate] = useState(initialDates.end);
  const [dateError, setDateError] = useState("");

  const today = formatDate(new Date());

  // Dashboard summary
  const totalProducts = products.length;

  const currentStock = products.reduce(
    (total, product) => total + Number(product.currentStock || 0),
    0,
  );

  const totalStockIn = transactions
    .filter((t) => t.transactionType === "IN")
    .reduce((total, t) => total + Number(t.quantity || 0), 0);

  const totalStockOut = transactions
    .filter((t) => t.transactionType === "OUT")
    .reduce((total, t) => total + Number(t.quantity || 0), 0);

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

  // Transactions within the selected date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = getTransactionDate(transaction);

      return (
        date &&
        date >= startDate &&
        date <= endDate &&
        ["IN", "OUT"].includes(transaction.transactionType)
      );
    });
  }, [transactions, startDate, endDate]);

  // Build daily chart and calendar data
  const dailyData = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return [];

    const result = [];
    const cursor = new Date(`${startDate}T12:00:00`);
    const last = new Date(`${endDate}T12:00:00`);

    while (cursor <= last) {
      const date = formatDate(cursor);

      const dayTransactions = filteredTransactions.filter(
        (t) => getTransactionDate(t) === date,
      );

      const stockIn = dayTransactions
        .filter((t) => t.transactionType === "IN")
        .reduce((sum, t) => sum + Number(t.quantity || 0), 0);

      const stockOut = dayTransactions
        .filter((t) => t.transactionType === "OUT")
        .reduce((sum, t) => sum + Number(t.quantity || 0), 0);

      result.push({
        date,
        label: cursor.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        stockIn,
        stockOut,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }, [filteredTransactions, startDate, endDate]);

  const rangeStockIn = filteredTransactions
    .filter((t) => t.transactionType === "IN")
    .reduce((sum, t) => sum + Number(t.quantity || 0), 0);

  const rangeStockOut = filteredTransactions
    .filter((t) => t.transactionType === "OUT")
    .reduce((sum, t) => sum + Number(t.quantity || 0), 0);

  // Donut chart calculations
  const totalMovement = rangeStockIn + rangeStockOut;

  const inPercentage = totalMovement ? (rangeStockIn / totalMovement) * 100 : 0;

  const outPercentage = totalMovement
    ? (rangeStockOut / totalMovement) * 100
    : 0;

  // This variable must be defined before return()
  const donutStyle = {
    background:
      totalMovement === 0
        ? "#e5e7eb"
        : `conic-gradient(#10b981 0% ${inPercentage}%, #f97316 ${inPercentage}% 100%)`,
  };

  const selectedTransactions = filteredTransactions
    .filter((t) => getTransactionDate(t) === selectedDate)
    .sort((a, b) => {
      const valueA =
        a.transactionTime ??
        a.transaction_time ??
        a.transactionDate ??
        a.createdAt ??
        a.date ??
        a.timestamp ??
        0;

      const valueB =
        b.transactionTime ??
        b.transaction_time ??
        b.transactionDate ??
        b.createdAt ??
        b.date ??
        b.timestamp ??
        0;

      return new Date(valueB).getTime() - new Date(valueA).getTime();
    });

  const changeDateRange = (newStart, newEnd) => {
    if (!newStart || !newEnd) return;

    if (newStart > newEnd) {
      setDateError("Start date cannot be after end date.");
      return;
    }

    if (newEnd > today) {
      setDateError("Future dates cannot be selected.");
      return;
    }

    const start = new Date(`${newStart}T12:00:00`);
    const end = new Date(`${newEnd}T12:00:00`);
    const days = Math.round((end - start) / 86400000) + 1;

    if (days > 7) {
      setDateError("Please select a maximum date range of 7 days.");
      return;
    }

    setDateError("");
    setStartDate(newStart);
    setEndDate(newEnd);

    if (selectedDate < newStart || selectedDate > newEnd) {
      setSelectedDate(newEnd);
    }
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTransactionTime = (transaction) => {
    const value =
      transaction.transactionTime ??
      transaction.transaction_time ??
      transaction.transactionDate ??
      transaction.createdAt ??
      transaction.date ??
      transaction.timestamp;

    if (!value) return "Time unavailable";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Time unavailable";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductName = (transaction) =>
    transaction.product?.productName ??
    transaction.productName ??
    transaction.product?.name ??
    transaction.productCode ??
    "Product";

  const maxDailyValue = Math.max(
    1,
    ...dailyData.flatMap((day) => [day.stockIn, day.stockOut]),
  );

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

      <section className="dashboard-analytics">
        <div className="analytics-heading">
          <div>
            <span className="dashboard-eyebrow">STOCK ANALYTICS</span>
            <p>Stock IN vs Stock OUT for up to 7 days.</p>
          </div>
        </div>

        <div className="date-range-controls">
          <label>
            Start date
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => changeDateRange(e.target.value, endDate)}
            />
          </label>

          <label>
            End date
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={today}
              onChange={(e) => changeDateRange(startDate, e.target.value)}
            />
          </label>

          <button
            type="button"
            className="analytics-reset-button"
            onClick={() => {
              const dates = getInitialDates();
              setStartDate(dates.start);
              setEndDate(dates.end);
              setSelectedDate(dates.end);
              setDateError("");
            }}
          >
            Last 7 days
          </button>
        </div>

        {dateError && (
          <p className="date-range-error" role="alert">
            {dateError}
          </p>
        )}

        <div className="movement-summary">
          <article className="movement-total movement-in">
            <span>📥 Total Stock IN</span>
            <strong>{rangeStockIn.toLocaleString("en-IN")}</strong>
            <small>{inPercentage.toFixed(1)}% of total movement</small>
          </article>

          <article className="movement-total movement-out">
            <span>📤 Total Stock OUT</span>
            <strong>{rangeStockOut.toLocaleString("en-IN")}</strong>
            <small>{outPercentage.toFixed(1)}% of total movement</small>
          </article>
        </div>

        {/* Donut chart */}
        <div className="donut-chart-section">
          <h3>Stock Movement Ratio</h3>

          <div className="donut-chart-layout">
            <div
              className="donut-chart"
              style={donutStyle}
              role="img"
              aria-label={`Stock IN ${inPercentage.toFixed(1)}%, Stock OUT ${outPercentage.toFixed(1)}%`}
            >
              <div className="donut-chart-center">
                <strong>{totalMovement.toLocaleString("en-IN")}</strong>
                <span>Total units</span>
              </div>
            </div>

            <div className="donut-chart-legend">
              <div className="donut-legend-item">
                <span className="donut-legend-label">
                  <i className="donut-dot donut-dot-in" />
                  Stock IN
                </span>
                <strong>{rangeStockIn.toLocaleString("en-IN")}</strong>
                <small>{inPercentage.toFixed(1)}%</small>
              </div>

              <div className="donut-legend-item">
                <span className="donut-legend-label">
                  <i className="donut-dot donut-dot-out" />
                  Stock OUT
                </span>
                <strong>{rangeStockOut.toLocaleString("en-IN")}</strong>
                <small>{outPercentage.toFixed(1)}%</small>
              </div>
            </div>
          </div>
        </div>

        {/* Daily bar chart */}
        <div className="daily-chart">
          <h3>Daily stock movement</h3>

          {dailyData.every((day) => day.stockIn === 0 && day.stockOut === 0) ? (
            <div className="analytics-empty">
              No stock movement found for this date range.
            </div>
          ) : (
            <div className="daily-chart-list">
              {dailyData.map((day) => (
                <div className="daily-chart-row" key={day.date}>
                  <span className="daily-chart-date">{day.label}</span>

                  <div className="daily-bars">
                    <div className="daily-bar-line">
                      <div
                        className="daily-bar daily-bar-in"
                        style={{
                          width: `${(day.stockIn / maxDailyValue) * 100}%`,
                        }}
                      />
                      <span>{day.stockIn}</span>
                    </div>

                    <div className="daily-bar-line">
                      <div
                        className="daily-bar daily-bar-out"
                        style={{
                          width: `${(day.stockOut / maxDailyValue) * 100}%`,
                        }}
                      />
                      <span>{day.stockOut}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="chart-legend">
            <span>
              <i className="legend-in" /> Stock IN
            </span>
            <span>
              <i className="legend-out" /> Stock OUT
            </span>
          </div>
        </div>
      </section>

      <section className="dashboard-calendar-section">
        <div className="calendar-heading">
          <div>
            <span className="dashboard-eyebrow">STOCK TRANSACTION HISTORY</span>
            <p>Select a date to view transactions.</p>
          </div>
        </div>

        <div className="stock-calendar">
          <div className="calendar-range-label">
            {formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}
          </div>

          <div className="calendar-days">
            {dailyData.map((day) => {
              const dateObject = new Date(`${day.date}T12:00:00`);

              return (
                <button
                  type="button"
                  key={day.date}
                  className={`calendar-day ${
                    selectedDate === day.date ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDate(day.date)}
                  aria-pressed={selectedDate === day.date}
                >
                  <span className="calendar-day-name">
                    {dateObject.toLocaleDateString("en-IN", {
                      weekday: "short",
                    })}
                  </span>

                  <strong>{dateObject.getDate()}</strong>

                  <span className="calendar-day-month">
                    {dateObject.toLocaleDateString("en-IN", {
                      month: "short",
                    })}
                  </span>

                  {(day.stockIn > 0 || day.stockOut > 0) && (
                    <span className="calendar-day-indicators">
                      {day.stockIn > 0 && (
                        <i className="calendar-dot dot-in" title="Stock IN" />
                      )}
                      {day.stockOut > 0 && (
                        <i className="calendar-dot dot-out" title="Stock OUT" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="selected-date-heading">
          <div>
            <h3>{formatDisplayDate(selectedDate)}</h3>
            <p>
              {selectedTransactions.length} transaction
              {selectedTransactions.length === 1 ? "" : "s"} found
            </p>
          </div>

          <input
            aria-label="Choose transaction date"
            type="date"
            min={startDate}
            max={endDate}
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value >= startDate && e.target.value <= endDate) {
                setSelectedDate(e.target.value);
              }
            }}
          />
        </div>

        {selectedTransactions.length === 0 ? (
          <div className="analytics-empty">
            No Stock IN or Stock OUT transactions on this date.
          </div>
        ) : (
          <div className="stock-history-list">
            {selectedTransactions.map((transaction, index) => (
              <article
                className="stock-history-item"
                key={transaction.id ?? `${selectedDate}-${index}`}
              >
                <div
                  className={`history-type-icon ${
                    transaction.transactionType === "IN"
                      ? "history-icon-in"
                      : "history-icon-out"
                  }`}
                >
                  {transaction.transactionType === "IN" ? "📥" : "📤"}
                </div>

                <div className="history-product">
                  <strong>{getProductName(transaction)}</strong>
                  <span>{formatTransactionTime(transaction)}</span>
                </div>

                <div
                  className={`history-quantity ${
                    transaction.transactionType === "IN"
                      ? "quantity-in"
                      : "quantity-out"
                  }`}
                >
                  {transaction.transactionType === "IN" ? "+" : "−"}
                  {Number(transaction.quantity || 0).toLocaleString("en-IN")}
                  <small>{transaction.transactionType}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-note">
        <div className="dashboard-note-icon">💡</div>
        <div>
          <h2>Inventory at a glance</h2>
          <p>
            Current Stock shows the combined available stock of all products.
            Stock Analysis and Transaction History show recorded movements
            within the selected date range.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

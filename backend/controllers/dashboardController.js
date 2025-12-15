import client from "../config/db.js";

const getMonthlyRevenue = async (req, res) => {
  try {
    // 1️⃣ Get raw revenue data for delivered orders
    const result = await client.query(`
      SELECT
        DATE_TRUNC('month', o.order_date) AS month,
        TO_CHAR(DATE_TRUNC('month', o.order_date), 'Mon') AS label,
        SUM(op.quantity * op.price) AS value
      FROM orders o
      JOIN order_products op ON o.order_id = op.order_id
      WHERE LOWER(o.order_status) = 'delivered'
      GROUP BY month
      ORDER BY month
    `);

    // 2️⃣ Initialize all 12 months with value 0
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const buckets = {};
    monthNames.forEach(m => { buckets[m] = 0 });

    // 3️⃣ Fill buckets with actual revenue from query
    result.rows.forEach(row => {
      const monthLabel = row.label.trim();
      buckets[monthLabel] = Number(row.value);
    });

    // 4️⃣ Convert to array format
    const monthlyRevenue = monthNames.map(m => ({
      label: m,
      value: buckets[m]
    }));

    res.status(200).json({
      success: true,
      data: monthlyRevenue
    });

  } catch (error) {
    console.error("Monthly revenue error:", error);
    res.status(500).json({ error: "Failed to fetch monthly revenue" });
  }
};

export { getMonthlyRevenue };

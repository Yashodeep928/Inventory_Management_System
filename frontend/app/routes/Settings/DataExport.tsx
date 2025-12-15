import Papa from "papaparse";

interface Props {
  customers: any[];
  orders: any[];
  products: any[];
}

export default function DataExport({ customers, orders, products }: Props) {
  const downloadCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card p-6 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <span className="mr-2">📊</span>
        Data Export
      </h2>

      <div className="space-y-3">
        <button
          onClick={() => downloadCSV(customers, "customers.csv")}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg
                     hover:bg-blue-700 transition-colors duration-200"
        >
          Export Customers CSV
        </button>

        <button
          onClick={() => downloadCSV(orders, "orders.csv")}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg
                     hover:bg-green-700 transition-colors duration-200"
        >
          Export Orders CSV
        </button>

        <button
          onClick={() => downloadCSV(products, "products.csv")}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg
                     hover:bg-purple-700 transition-colors duration-200"
        >
          Export Products CSV
        </button>
      </div>
    </div>
  );
}

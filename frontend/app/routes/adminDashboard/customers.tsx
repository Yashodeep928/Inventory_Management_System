import { useEffect, useState } from "react";

interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  orders_count?: string;
}

interface CustomerDetail {
  customer: Customer;
  orders: Array<{
    order_id: number;
    order_status: string;
    order_date: string;
    product_id: number;
    quantity: number;
    price: number;
    product_name: string;
  }>;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/orders/all-customers");
      const data = await res.json();
      // Add active field and orders_count for customers that don't have orders
      const customersWithDefaults = data.customers?.map((customer: any) => ({
        ...customer,
        active: customer.active ?? true,
        orders_count: customer.orders_count ?? "0"
      })) ?? [];
      setCustomers(customersWithDefaults);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/customer-details/${id}`);
      const data = await res.json();
      setSelectedCustomer(data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  useEffect(() => { 
    fetchCustomers(); 
  }, []);

  const toggleStatus = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/orders/toggle-customer/${id}`, { method: "PUT" });
      fetchCustomers();
    } catch (error) {
      console.error("Error toggling customer status:", error);
    }
  };

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && c.active) ||
                         (filterStatus === "inactive" && !c.active);
    return matchesSearch && matchesStatus;
  });

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.active).length,
    inactive: customers.filter(c => !c.active).length,
    totalOrders: customers.reduce((sum, c) => sum + (parseInt(c.orders_count || "0")), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-gray-900">{customerStats.total}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-gray-900">{customerStats.active}</div>
          <div className="text-sm text-gray-600">Active Customers</div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-gray-900">{customerStats.inactive}</div>
          <div className="text-sm text-gray-600">Inactive Customers</div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-purple-500">
          <div className="text-2xl font-bold text-gray-900">{customerStats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Customers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Orders</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((customer) => (
                <tr key={customer.user_id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">ID: {customer.user_id}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    {customer.phone && (
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {customer.orders_count || 0} orders
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {customer.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchCustomerDetails(customer.user_id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleStatus(customer.user_id)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          customer.active 
                            ? "bg-red-500 hover:bg-red-600 text-white" 
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {customer.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg">No customers found</div>
            <div className="text-gray-400 text-sm mt-1">
              {search || filterStatus !== "all" ? "Try adjusting your filters" : "Customers will appear here when they register"}
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Customer Details: {selectedCustomer.customer.name}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Email:</span> {selectedCustomer.customer.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedCustomer.customer.phone || "Not provided"}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.customer.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedCustomer.customer.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Statistics</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Total Orders:</span> {selectedCustomer.orders.length}</div>
                    <div><span className="font-medium">Total Spent:</span> 
                      ${selectedCustomer.orders.reduce((sum, order) => sum + (order.price * order.quantity), 0).toFixed(2)}
                    </div>
                    <div><span className="font-medium">Last Order:</span> 
                      {selectedCustomer.orders.length > 0 
                        ? new Date(Math.max(...selectedCustomer.orders.map(o => new Date(o.order_date).getTime()))).toLocaleDateString()
                        : "No orders yet"
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="glass-card p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Order History</h4>
                {selectedCustomer.orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Order ID</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Product</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Quantity</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Price</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Status</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedCustomer.orders.map((order, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3 font-medium">#{order.order_id}</td>
                            <td className="py-2 px-3">{order.product_name}</td>
                            <td className="py-2 px-3">{order.quantity}</td>
                            <td className="py-2 px-3">${(order.price * order.quantity).toFixed(2)}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.order_status}
                              </span>
                            </td>
                            <td className="py-2 px-3">{new Date(order.order_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No orders found for this customer.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

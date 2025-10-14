import { useEffect, useState } from "react";
import { useAppSelector } from "src/store/hooks";
import CheckIcon from "~/Icons/userIcons/CheckIcon";
import TruckIcon from "~/Icons/userIcons/TruckIcon";
import ClockIcon from "~/Icons/userIcons/ClockIcon";
import { io, Socket } from "socket.io-client";
import { useNavigate, Link } from "react-router";

type Product = {
  product_id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
};
type OrderRow = { order_id: number; order_status: string; order_date: string };

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  delivered: { bg: "#ECFDF5", text: "#059669", icon: CheckIcon },
  shipped: { bg: "#DBEAFE", text: "#2563EB", icon: TruckIcon },
  pending: { bg: "#FEF3C7", text: "#D97706", icon: ClockIcon },
  default: { bg: "#F3F4F6", text: "#6B7280", icon: ClockIcon },
};

function getStatusColor(status: string) {
  return statusColors[status.toLowerCase()] || statusColors.default;
}

function ProductCard({ product, isSelected, onSelect, onDeselect }: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}) {
  return (
    <div
      className={`glass-card hover-lift p-4 cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 shadow-lg"
          : "border-gray-200 hover:border-emerald-300"
      }`}
      onClick={isSelected ? onDeselect : onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600">${product.price}</span>
            <span className="text-sm text-gray-500">
              {product.quantity > 0 ? (
                <span className="text-green-600">In Stock ({product.quantity})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </span>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isSelected ? onDeselect() : onSelect();
        }}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isSelected
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        } ${product.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={product.quantity === 0}
      >
        {isSelected ? "Remove from Cart" : "Add to Cart"}
      </button>
    </div>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  const { bg, text, icon: StatusIcon } = getStatusColor(order.order_status);
  
  return (
    <div className="glass-card hover-lift p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">Order #{order.order_id}</h4>
          <p className="text-sm text-gray-600">
            {new Date(order.order_date).toLocaleDateString()} at{" "}
            {new Date(order.order_date).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon />
          <span
            className="px-3 py-1 rounded-full text-xs font-medium border"
            style={{ backgroundColor: bg, color: text }}
          >
            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const authUser = useAppSelector((s) => s.auth.user);
  const firstName = (authUser?.name ?? "User").split(" ")[0];

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products/get");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId?: number) => {
    if (!userId && !authUser?.user_id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/orders/get/${userId ?? authUser!.user_id}`);
      const data = await res.json();
      const formatted = (data.orders ?? []).map((o: OrderRow) => ({
        ...o,
        order_status: (o.order_status ?? "").toLowerCase(),
      }));
      setOrders(formatted);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!authUser?.user_id) return;
    const socket: Socket = io("http://localhost:3000");

    const handleOrderUpdated = (_payload: any) => {
      fetchOrders(authUser.user_id);
    };

    const handleNotification = (_payload: any) => {
      fetchOrders(authUser.user_id);
    };

    socket.on("orderUpdated", handleOrderUpdated);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("orderUpdated", handleOrderUpdated);
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [authUser?.user_id]);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const categories = [...new Set(products.map((p) => p.category))];

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser?.user_id) return alert("User not logged in");
    if (selectedProduct === null) return alert("Select a product first");

    const product = products.find((p) => p.product_id === selectedProduct);
    if (!product) return alert("Invalid product selected");

    if (quantity > product.quantity) return alert("Not enough stock available");

    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/create/${authUser.user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: product.product_id,
            quantity,
            price: product.price,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        return alert("Failed to place order: " + errorData.error);
      }

      const newQuantity = product.quantity - quantity;
      const updateRes = await fetch(
        `http://localhost:3000/api/products/update/${product.product_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: newQuantity
          }),
        }
      );

      if (!updateRes.ok) {
        const updateError = await updateRes.json();
        console.error("Failed to update product quantity:", updateError);
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === product.product_id ? { ...p, quantity: newQuantity } : p
        )
      );

      setSelectedProduct(null);
      setQuantity(1);
      alert("Order placed successfully!");
      
      fetchOrders(authUser.user_id);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Check console for details.");
    }
  };

  const selectedProductObj = products.find((p) => p.product_id === selectedProduct);
  const isOrderDisabled =
    !selectedProductObj || quantity > selectedProductObj.quantity;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
            <p className="text-gray-600 mt-1">Browse our inventory and place your orders.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-sm text-emerald-700 font-medium">Your Orders</div>
              <div className="text-2xl font-bold text-emerald-900">{orders.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Selector */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🏷️</span>
              Browse Products
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.length === 0 && selectedCategory && (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500 text-lg">No products found in this category.</div>
                  <div className="text-gray-400 text-sm mt-1">Try selecting a different category.</div>
                </div>
              )}
              
              {filteredProducts.length === 0 && !selectedCategory && (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500 text-lg">Select a category to browse products.</div>
                  <div className="text-gray-400 text-sm mt-1">Choose from {categories.length} available categories.</div>
                </div>
              )}

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  isSelected={selectedProduct === product.product_id}
                  onSelect={() => setSelectedProduct(product.product_id)}
                  onDeselect={() => setSelectedProduct(null)}
                />
              ))}
            </div>
          </div>

          {/* Order Form */}
          {selectedProduct !== null && (
            <div className="glass-card p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🛒</span>
                Place Order
              </h4>
              
              {selectedProductObj && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">{selectedProductObj.name}</h5>
                      <p className="text-sm text-gray-600">{selectedProductObj.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">${selectedProductObj.price}</div>
                      <div className="text-sm text-gray-500">
                        Stock: {selectedProductObj.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={placeOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedProductObj?.quantity || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter quantity"
                  />
                </div>
                
                {selectedProductObj && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Total Amount:</span>
                      <span className="font-semibold text-emerald-900">
                        ${(selectedProductObj.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isOrderDisabled}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isOrderDisabled ? "Cannot Place Order" : "Place Order"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Recent Orders Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Recent Orders
            </h3>
            
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <OrderCard key={order.order_id} order={order} />
                ))}
                
                {orders.length > 5 && (
                  <div className="text-center pt-3">
                    <Link
                      to="/user/orders"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View All Orders →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg">No orders yet</div>
                <div className="text-gray-400 text-sm mt-1">Your orders will appear here.</div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Quick Stats
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold text-gray-900">{orders.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {orders.filter(o => o.order_status === 'pending').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivered</span>
                <span className="font-semibold text-green-600">
                  {orders.filter(o => o.order_status === 'delivered').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

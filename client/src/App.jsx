import { useEffect, useState } from "react";
import "./App.css";
import AdminLogin from "./AdminLogin";
import dishwashImg from "./assets/dishwash.jpg";
import detergentImg from "./assets/detergent.jpg";
import floorCleanerImg from "./assets/floor-cleaner.jpg";
import toiletCleanerImg from "./assets/toilet-cleaner.jpg";
import bathroomCleanerImg from "./assets/bathroom-cleaner.jpg";
import glassCleanerImg from "./assets/glass-cleaner.jpg";
import surfaceCleanerImg from "./assets/surface-cleaner.jpg";
import scrubberImg from "./assets/scrubber.jpg";

function App() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showShippingPolicy, setShowShippingPolicy] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(
  window.location.pathname === "/admin"
);
useEffect(() => {
  const checkAdminSession = async () => {
    if (!isAdminPage) return;

    const token = localStorage.getItem("sehgalAdminToken");

    if (!token) {
      setIsAdmin("login");
      return;
    }

    const isValid = await verifyAdminToken();

    if (!isValid) {
      setIsAdmin("login");
    } else {
      setIsAdmin("dashboard");
    }
  };

  checkAdminSession();
}, [isAdminPage]);
const [contactMessages, setContactMessages] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [searchQuery, setSearchQuery] = useState("");
const [contactForm, setContactForm] = useState({
  name: "",
  email: "",
  phone: "",
  message: "",
});
const [customers, setCustomers] = useState([]);
const [contactLoading, setContactLoading] = useState(false);
const [showSearch, setShowSearch] = useState(false);
const [resetToken, setResetToken] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [authForm, setAuthForm] = useState({
  name: "",
  email: "",
  mobile: "",
  password: "",
});
const [stats, setStats] = useState({
  customers: 0,
  products: 0,
  orders: 0,
  sales: 0,
  messages: 0,
});






const [authError, setAuthError] = useState("");
const [authLoading, setAuthLoading] = useState(false);
const [loggedInUser, setLoggedInUser] = useState(null);
   const [showCheckout, setShowCheckout] = useState(false);
const [orderPlaced, setOrderPlaced] = useState(false);
const [isAdmin, setIsAdmin] = useState("none");
const [showProducts, setShowProducts] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  image: "",
  stock: "",
  category: "Cleaning",
});
const [editingProduct, setEditingProduct] = useState(null);
const [productMessage, setProductMessage] = useState("");
const [customer, setCustomer] = useState({
  name: "",
  mobile: "",
  address: "",
  city: "",
  pincode: "",
});

const [paymentMethod, setPaymentMethod] = useState("COD");
const [placingOrder, setPlacingOrder] = useState(false);
const [orderId, setOrderId] = useState("");
const [products, setProducts] = useState([]);
const [orderError, setOrderError] = useState("");
const fetchContactMessages = async () => {
  try {
    const token = localStorage.getItem("sehgalAdminToken");

    const response = await fetch(
      "https://sehgal-group-backend.onrender.com/api/admin/contacts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch messages."
      );
    }

    setContactMessages(data);
  } catch (error) {
    console.error("Contact messages error:", error);
  }
};
const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem("sehgalAdminToken");

    const response = await fetch(
      "https://sehgal-group-backend.onrender.com/api/admin/customers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch customers."
      );
    }

    setCustomers(data);
  } catch (error) {
    console.error("Customers error:", error);
  }
};
const verifyAdminToken = async () => {
  try {
    const token = localStorage.getItem("sehgalAdminToken");

    if (!token) {
      return false;
    }

    const response = await fetch(
      "https://sehgal-group-backend.onrender.com/api/admin/verify",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      localStorage.removeItem("sehgalAdminToken");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Admin token verification error:", error);

    localStorage.removeItem("sehgalAdminToken");
    return false;
  }
};
const fetchStats = async () => {
  try {
    const token = localStorage.getItem("sehgalAdminToken");

    const [customersResponse, ordersResponse, messagesResponse] =
      await Promise.all([
        fetch("https://sehgal-group-backend.onrender.com/api/admin/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("https://sehgal-group-backend.onrender.com/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("https://sehgal-group-backend.onrender.com/api/admin/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

    const customersData = await customersResponse.json();
    const ordersData = await ordersResponse.json();
    const messagesData = await messagesResponse.json();

    const totalSales = ordersData
      .filter((order) => order.orderStatus !== "CANCELLED")
      .reduce(
        (total, order) => total + Number(order.totalAmount || 0),
        0
      );

    setStats({
      customers: customersData.length,
      products: products.length,
      orders: ordersData.length,
      sales: totalSales,
      messages: messagesData.length,
    });
  } catch (error) {
    console.error("Stats error:", error);
  }
};





  
const fetchProducts = async () => {
  try {
    const response = await fetch(
      "https://sehgal-group-backend.onrender.com/api/products"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const formattedProducts = data.map((product) => ({
      id: product._id,
      name: product.name,
      image: product.image,
      oldPrice: product.oldPrice,
      price: product.price,
      desc: product.description,
      stock: product.stock,
    }));

    setProducts(formattedProducts);
  } catch (error) {
    console.log(
      "Products fetch error:",
      error.message
    );
  }
};

useEffect(() => {
  fetchProducts();
}, []);




useEffect(() => {
  if (isAdmin !== "orders") return;

  const fetchAdminOrders = async () => {
    setLoadingAdminOrders(true);

    try {
const token = localStorage.getItem("sehgalAdminToken");

const response = await fetch(
  "https://sehgal-group-backend.onrender.com/api/admin/orders",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setAdminOrders(data);
    } catch (error) {
      console.log("Admin orders error:", error.message);
    } finally {
      setLoadingAdminOrders(false);
    }
  };

  fetchAdminOrders();
}, [isAdmin]);
useEffect(() => {
  const savedUser = localStorage.getItem("sehgalUser");
  const savedToken = localStorage.getItem("sehgalToken");

  if (savedUser && savedToken) {
    setLoggedInUser(JSON.parse(savedUser));
  }
}, []);
useEffect(() => {
  if (isAdmin === "contacts") {
    fetchContactMessages();
  }
}, [isAdmin]);
useEffect(() => {
  if (isAdmin === "customers") {
    fetchCustomers();
  }
}, [isAdmin]);
useEffect(() => {
  if (isAdmin === "stats") {
    fetchStats();
  }
}, [isAdmin]);




  const [showOrders, setShowOrders] = useState(false);
const [myOrders, setMyOrders] = useState([]);
const [loadingOrders, setLoadingOrders] = useState(false);
const [adminOrders, setAdminOrders] = useState([]);
const [loadingAdminOrders, setLoadingAdminOrders] = useState(false);
const handleAuth = async () => {
  setAuthError("");

  if (
    authMode === "signup" &&
    (!authForm.name ||
      !authForm.email ||
      !authForm.mobile ||
      !authForm.password)
  ) {
    setAuthError("Please fill all fields.");
    return;
  }

  if (
    authMode === "login" &&
    (!authForm.email || !authForm.password)
  ) {
    setAuthError("Please enter email and password.");
    return;
  }

  setAuthLoading(true);

  try {
    const endpoint =
      authMode === "signup"
        ? "https://sehgal-group-backend.onrender.com/api/auth/signup"
        : "https://sehgal-group-backend.onrender.com/api/auth/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authForm),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed.");
    }

    setLoggedInUser(data.user);
    localStorage.setItem("sehgalToken", data.token);
    setCustomer((currentCustomer) => ({
  ...currentCustomer,
  name: data.user.name,
  mobile: data.user.mobile,
}));
    localStorage.setItem(
      "sehgalUser",
      JSON.stringify(data.user)
    );

    setShowAuth(false);

    setAuthForm({
      name: "",
      email: "",
      mobile: "",
      password: "",
    });

    alert(
      authMode === "signup"
        ? "Account created successfully!"
        : "Login successful!"
    );
  } catch (error) {
    setAuthError(error.message);
  } finally {
    setAuthLoading(false);
  }
};



  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("sehgalToken");

if (!token) {
  setOrderError("Please login to place an order.");
  setShowCheckout(false);
  setShowAuth(true);
  setAuthMode("login");
  return;
}

    if (
    !customer.name ||
    !customer.mobile ||
    !customer.address ||
    !customer.city ||
    !customer.pincode
   ) {
    setOrderError("Please fill all delivery details.");
    return;
   }

   if (cart.length === 0) {
    setOrderError("Your cart is empty.");
    return;
   }

   setPlacingOrder(true);
   setOrderError("");

   try {
   

   const response = await fetch(
   "https://sehgal-group-backend.onrender.com/api/orders",
   {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
   customer: {
    userId: loggedInUser?.id || null,
    name: customer.name,
    mobile: customer.mobile,
    address: customer.address,
    city: customer.city,
    pincode: customer.pincode,
   },

   items: cart.map((item) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    })),

  totalAmount: totalPrice,
  paymentMethod,
}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    setOrderId(data.orderId);
    setProducts((currentProducts) =>
  currentProducts.map((product) => {
    const orderedItem = cart.find(
      (item) => item.id === product.id
    );

    if (!orderedItem) {
      return product;
    }

    return {
      ...product,
      stock: product.stock - orderedItem.quantity,
    };
  })
);
    setOrderPlaced(true);
  } catch (error) {
    setOrderError(error.message);
  } finally {
    setPlacingOrder(false);
  }
};
const handleCancelOrder = async (orderId) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmCancel) {
    return;
  }

  try {
    const token = localStorage.getItem("sehgalToken");

    const response = await fetch(
      `https://sehgal-group-backend.onrender.com/api/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to cancel order."
      );
    }

    setMyOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              orderStatus: "CANCELLED",
            }
          : order
      )
    );
   await fetchProducts();
    alert("Order cancelled successfully.");
  } catch (error) {
    alert(error.message);
  }
};
const fetchMyOrders = async () => {
  if (!loggedInUser) {
  alert("Please login to view your orders.");
  return;
}
  setLoadingOrders(true);

  try {
const token = localStorage.getItem("sehgalToken");

const response = await fetch(
  "https://sehgal-group-backend.onrender.com/api/orders",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    setMyOrders(data);
    setShowOrders(true);
  } catch (error) {
    console.log("Orders fetch error:", error.message);
  } finally {
    setLoadingOrders(false);
  }
};
const handleAddProduct = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("https://sehgal-group-backend.onrender.com/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    setProducts((currentProducts) => [
{
  id: data.product._id,
  name: data.product.name,
  image: data.product.image,
  oldPrice: data.product.oldPrice,
  price: data.product.price,
  desc: data.product.description,
  stock: data.product.stock,
},
      ...currentProducts,
    ]);

    setProductMessage("Product added successfully!");

    setNewProduct({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      image: "",
      stock: "",
      category: "Cleaning",
    });
  } catch (error) {
    setProductMessage(error.message);
  }
};
  // ADD TO CART
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setShowCart(true);
  };

  // INCREASE QUANTITY
const increaseQuantity = (id) => {
  setCart((currentCart) =>
    currentCart.map((item) => {
      if (item.id === id) {
        if (item.quantity >= item.stock) {
          alert(`Only ${item.stock} item(s) available in stock.`);
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    })
  );
};

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // REMOVE PRODUCT
  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // TOTAL PRICE
  // TOTAL PRICE
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
if (isAdminPage && isAdmin === "none") {
  return (
    <AdminLogin
      onLogin={() => {
        setIsAdmin("dashboard");
      }}
    />
  );
}
if (isAdmin === "login") {
  return (
    <AdminLogin
      onLogin={() => setIsAdmin("dashboard")}
    />
  );
}


if (isAdmin === "orders") {
  return (
    <div className="admin-panel">

      <div className="admin-header">
        <div>
          <h1>SEHGAL GROUP</h1>
          <p>Manage Orders</p>
        </div>

        <button onClick={() => setIsAdmin("dashboard")}>
          ← Dashboard
        </button>
      </div>

      <div className="admin-product-list">

        <h2>Customer Orders</h2>

        {loadingAdminOrders ? (
          <p>Loading orders...</p>
        ) : adminOrders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          adminOrders.map((order) => (
            <div
              className="admin-product-item"
              key={order._id}
            >
              <div className="admin-product-info">

                <h3>
                  Order #{order._id.slice(-8)}
                </h3>

                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer.name}
                </p>

                <p>
                  <strong>Mobile:</strong>{" "}
                  {order.customer.mobile}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.customer.address},{" "}
                  {order.customer.city} -{" "}
                  {order.customer.pincode}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.paymentMethod}
                </p>

             <div className="order-status">
  <label>Status:</label>

  <select
    value={order.orderStatus}
    onChange={async (e) => {
      const newStatus = e.target.value;

      try {
        const response = await fetch(
          `https://sehgal-group-backend.onrender.com/api/orders/${order._id}/status`,
          {
            method: "PUT",
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("sehgalAdminToken")}`,
},
            body: JSON.stringify({
              orderStatus: newStatus,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update status");
        }

        setAdminOrders((currentOrders) =>
          currentOrders.map((item) =>
            item._id === order._id
              ? { ...item, orderStatus: newStatus }
              : item
          )
        );

        alert("Order status updated successfully!");
      } catch (error) {
        alert(error.message);
      }
    }}
  >
    <option value="PLACED">PLACED</option>
    <option value="PROCESSING">PROCESSING</option>
    <option value="SHIPPED">SHIPPED</option>
    <option value="DELIVERED">DELIVERED</option>
    <option value="CANCELLED">CANCELLED</option>
  </select>
</div>

                <p>
                  <strong>Total:</strong>{" "}
                  ₹{order.totalAmount}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <h4>Products:</h4>

                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.name} × {item.quantity} — ₹
                    {item.price * item.quantity}
                  </p>
                ))}

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}




if (isAdmin === "products") {
  return (
    <div className="admin-panel">

      <div className="admin-header">
        <div>
          <h1>SEHGAL GROUP</h1>
          <p>Manage Products</p>
        </div>

        <button onClick={() => setIsAdmin("dashboard")}>
          ← Dashboard
        </button>
      </div>

      <div className="admin-product-form">

        <h2>Add New Product</h2>

        <form onSubmit={handleAddProduct}>

          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                description: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Selling Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Old Price"
            value={newProduct.oldPrice}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                oldPrice: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Image Path e.g. /images/dishwash.jpg"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                image: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                stock: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
          />

          <button type="submit">
            ➕ Add Product
          </button>

        </form>

        {productMessage && (
          <p className="product-message">
            {productMessage}
          </p>
        )}

      </div>



    </div>
  );
}
if (isAdmin === "stats") {
  return (
    <div className="admin-panel">

      <div className="admin-header">
        <div>
          <h1>SEHGAL GROUP</h1>
          <p>Store Statistics</p>
        </div>

        <button onClick={() => setIsAdmin("dashboard")}>
          ← Back
        </button>
      </div>

      <div className="admin-cards">

        <div className="admin-card">
          <div className="admin-card-icon">👥</div>
          <h3>Total Customers</h3>
          <p>{stats.customers}</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">📦</div>
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">🛒</div>
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">💰</div>
          <h3>Total Sales</h3>
          <p>₹{stats.sales}</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">💬</div>
          <h3>Messages</h3>
          <p>{stats.messages}</p>
        </div>

      </div>

    </div>
  );
}




if (isAdmin === "customers") {
  return (
    <div className="admin-panel">

      <div className="admin-header">
        <div>
          <h1>SEHGAL GROUP</h1>
          <p>Registered Customers</p>
        </div>

        <button onClick={() => setIsAdmin("dashboard")}>
          ← Back
        </button>
      </div>

      <div className="admin-product-list">

        <h2>Customers</h2>

        {customers.length === 0 ? (
          <p>No customers registered yet.</p>
        ) : (
          customers.map((customer) => (
            <div
              className="admin-product-item"
              key={customer._id}
            >
              <div className="admin-product-info">

                <h3>{customer.name}</h3>

                <p>
                  <strong>Email:</strong> {customer.email}
                </p>

                <p>
                  <strong>Mobile:</strong> {customer.mobile}
                </p>

                <p>
                  <strong>Registered:</strong>{" "}
                  {new Date(
                    customer.createdAt
                  ).toLocaleString()}
                </p>

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}




 if (isAdmin === "contacts") {
  return (
    <div className="admin-panel">

      <div className="admin-header">
        <div>
          <h1>SEHGAL GROUP</h1>
          <p>Customer Messages</p>
        </div>

        <button onClick={() => setIsAdmin("dashboard")}>
          ← Back
        </button>
      </div>

      <div className="admin-product-list">

        <h2>Contact Messages</h2>

        {contactMessages.length === 0 ? (
  <p>No contact messages available.</p>
) : (
  contactMessages.map((contact) => (
    <div
      key={contact._id}
      className="admin-product-item"
    >
      <div className="admin-product-info">
        <h3>{contact.name}</h3>

        <p>
          <strong>Email:</strong> {contact.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {contact.phone || "Not provided"}
        </p>

        <p>
          <strong>Message:</strong> {contact.message}
        </p>

        <p>
          <strong>Status:</strong> {contact.status}
        </p>

        <small>
          {new Date(contact.createdAt).toLocaleString()}
        </small>
      </div>
    </div>
  ))
)}

      </div>

    </div>
  );
}
 if (isAdmin === "dashboard") {
  return (
    <div className="admin-panel">

      <div className="admin-header">
        <div>
          <h1>SEHGAL GROUP</h1>
          <p>Admin Dashboard</p>
        </div>

         <button
     onClick={() => {
     localStorage.removeItem("sehgalAdminToken");
     setIsAdmin("none");
     window.location.href = "/admin";
      }}
      >
     Logout
     </button>
      </div>

      <div className="admin-welcome">
        <h2>Welcome, Admin 👋</h2>
        <p>Manage your SEHGAL GROUP store from here.</p>
      </div>

      <div className="admin-cards">

        <div className="admin-card">
          <div className="admin-card-icon">📦</div>
          <h3>Products</h3>
          <p>Add, edit and manage products.</p>
     <button onClick={() => setIsAdmin("products")}>
     Manage Products
     </button>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">🛒</div>
          <h3>Orders</h3>
          <p>View and manage customer orders.</p>
        <button onClick={() => setIsAdmin("orders")}>
      Manage Orders
     </button>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">👥</div>
          <h3>Customers</h3>
          <p>View your customer information.</p>
          <button onClick={() => setIsAdmin("customers")}>
  View Customers
</button>
        </div>
        <div className="admin-card">
  <div className="admin-card-icon">💬</div>
  <h3>Messages</h3>
  <p>View customer contact messages.</p>

  <button onClick={() => setIsAdmin("contacts")}>
    View Messages
  </button>
</div>
        <div className="admin-card">
          <div className="admin-card-icon">📊</div>
          <h3>Dashboard</h3>
          <p>View store performance and sales.</p>
          <button onClick={() => setIsAdmin("stats")}>
  View Stats
</button>
        </div>

      </div>
            {editingProduct && (
        <div className="admin-product-form">

          <h2>Edit Product</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                const response = await fetch(
                  `https://sehgal-group-backend.onrender.com/api/products/${editingProduct.id}`,
                  {
                    method: "PUT",
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("sehgalAdminToken")}`,
},
                    body: JSON.stringify({
                      name: editingProduct.name,
                      description: editingProduct.desc,
                      price: editingProduct.price,
                      oldPrice: editingProduct.oldPrice,
                      image: editingProduct.image,
                      stock: editingProduct.stock,
                      category: "Cleaning",
                    }),
                  }
                );

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(
                    data.message || "Failed to update product"
                  );
                }

                setProducts((currentProducts) =>
                  currentProducts.map((product) =>
                    product.id === editingProduct.id
                      ? {
                          id: data.product._id,
                          name: data.product.name,
                          image: data.product.image,
                          oldPrice: data.product.oldPrice,
                          price: data.product.price,
                          desc: data.product.description,
                          stock: data.product.stock,
                        }
                      : product
                  )
                );

                setEditingProduct(null);
                setProductMessage("Product updated successfully!");

              } catch (error) {
                setProductMessage(error.message);
              }
            }}
          >
           <label>Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
              required
            />
           <label>Product Description</label>
            <textarea
              placeholder="Product Description"
              value={editingProduct.desc}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  desc: e.target.value,
                })
              }
              required
            />
           <label>Selling Price</label>
            <input
              type="number"
              
              placeholder="Selling Price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
              required
            />
            <label>Stock Quantity</label>
 <input
  type="number"
  placeholder="Stock Quantity"
  min="0"
  value={editingProduct.stock}
  onChange={(e) =>
    setEditingProduct({
      ...editingProduct,
      stock: Number(e.target.value),
    })
  }
  required
/>
             <label>Old Price</label>
            <input
              type="number"
              placeholder="Old Price"
              value={editingProduct.oldPrice}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  oldPrice: e.target.value,
                })
              }
            />
            <label>Image Path</label>
            <input
              type="text"
              placeholder="Image Path"
              value={editingProduct.image}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  image: e.target.value,
                })
              }
              required
            />

            <div>
              <button type="submit">
                💾 Update Product
              </button>

              <button
                type="button"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      )}
            <div className="admin-product-list">

        <h2>Existing Products</h2>

        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div
              className="admin-product-item"
              key={product.id}
            >

              <img
                src={product.image}
                alt={product.name}
              />

              <div className="admin-product-info">

                <h3>{product.name}</h3>

                <p>{product.desc}</p>

                <strong>₹{product.price}</strong>

              </div>

              <button
                className="edit-product-btn"
                onClick={() => setEditingProduct(product)}
              >
                ✏️ Edit
              </button>

              <button
                className="delete-product-btn"
                onClick={async () => {

                  const confirmDelete = window.confirm(
                    `Delete ${product.name}?`
                  );

                  if (!confirmDelete) return;

                  try {
                    const response = await fetch(
                      `https://sehgal-group-backend.onrender.com/api/products/${product.id}`,
                  {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("sehgalAdminToken")}`,
  },
}
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(
                        data.message || "Failed to delete product"
                      );
                    }

                    setProducts((currentProducts) =>
                      currentProducts.filter(
                        (item) => item.id !== product.id
                      )
                    );

                  } catch (error) {
                    alert(error.message);
                  }

                }}
              >
                🗑️ Delete
              </button>

            </div>
          ))
        )}

      </div>
    </div>
  );
 }

  

  return (
    <div className="app">



  {showAuth && (
  <div className="auth-overlay">
    <div className="auth-box">

      <button
        type="button"
        className="auth-close"
        onClick={() => setShowAuth(false)}
      >
        ×
      </button>
     {authMode === "reset" ? (
  <>
    <h2>Reset Password</h2>

    <p>Create a new password for your account.</p>

    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />

    <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    {authError && (
      <p className="auth-error">
        {authError}
      </p>
    )}

    <button
      type="button"
      className="auth-submit"
      onClick={async () => {
        if (!newPassword || !confirmPassword) {
          setAuthError("Please enter both password fields.");
          return;
        }

        if (newPassword !== confirmPassword) {
          setAuthError("Passwords do not match.");
          return;
        }

        setAuthLoading(true);
        setAuthError("");

        try {
          const response = await fetch(
            "https://sehgal-group-backend.onrender.com/api/auth/reset-password",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                resetToken,
                newPassword,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to reset password."
            );
          }

          alert("Password reset successfully!");

          setAuthMode("login");
          setAuthForm({
            ...authForm,
            password: "",
          });
          setResetToken("");
          setNewPassword("");
          setConfirmPassword("");

        } catch (error) {
          setAuthError(error.message);
        } finally {
          setAuthLoading(false);
        }
      }}
      disabled={authLoading}
    >
      {authLoading ? "Please wait..." : "Reset Password"}
    </button>
  </>
) : authMode === "forgot" ? (
        <>
          <h2>Forgot Password?</h2>

          <p>
            Enter your registered email address to reset
            your password.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({
                ...authForm,
                email: e.target.value,
              })
            }
          />


<button
  type="button"
  className="auth-submit"
  onClick={async () => {
    if (!authForm.email) {
      setAuthError("Please enter your email address.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(
        "https://sehgal-group-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authForm.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to process request."
        );
      }

      setResetToken(data.resetToken);
setNewPassword("");
setConfirmPassword("");
setAuthError("");
setAuthMode("reset");

    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  }}
  disabled={authLoading}
>
  {authLoading ? "Please wait..." : "Continue"}
</button>




          {authError && (
            <p className="auth-error">
              {authError}
            </p>
          )}

          <div className="auth-switch">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
            >
              ← Back to Login
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>
            {authMode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h2>

          <p>
            {authMode === "login"
              ? "Login to your Sehgal Group account"
              : "Create your Sehgal Group account"}
          </p>

          {authMode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Mobile Number"
                value={authForm.mobile}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    mobile: e.target.value,
                  })
                }
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({
                ...authForm,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({
                ...authForm,
                password: e.target.value,
              })
            }
          />

          {authMode === "login" && (
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => {
                setAuthError("");
                setAuthMode("forgot");
              }}
            >
              Forgot Password?
            </button>
          )}

          {authError && (
            <p className="auth-error">
              {authError}
            </p>
          )}

          <button
            type="button"
            className="auth-submit"
            onClick={handleAuth}
            disabled={authLoading}
          >
            {authLoading
              ? "Please wait..."
              : authMode === "login"
              ? "Login"
              : "Create Account"}
          </button>

          <div className="auth-switch">

            {authMode === "login" ? (
              <>
                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                >
                  Login
                </button>
              </>
            )}

          </div>
        </>
      )}

    </div>
  </div>
)}
      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="logo">
          <span>SEHGAL</span> GROUP
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#combos">Combos</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-icons">

          <button
  type="button"
  onClick={() => setShowSearch(!showSearch)}
  title="Search"
>
  🔍
</button>

<button
  type="button"
  onClick={() => {
    setAuthMode("login");
    setAuthError("");
    setShowAuth(true);
  }}
>
  👤
</button>
{loggedInUser && (
  <button
    type="button"
    className="logout-button"
    onClick={() => {
      localStorage.removeItem("sehgalUser");
      localStorage.removeItem("sehgalToken");
      setLoggedInUser(null);
      alert("Logged out successfully!");
    }}
  >
    Logout
  </button>
)}
 <button
  type="button"
  onClick={fetchMyOrders}
  title="My Orders"
 >
  📦
 </button>

          <button
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            🛒

            {totalItems > 0 && (
              <span className="cart-count">
                {totalItems}
              </span>
            )}
          </button>

        </div>
       {showSearch && (
  <div className="search-bar">

    <input
      type="text"
      placeholder="Search cleaning products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      autoFocus
    />

    <button
      type="button"
      onClick={() => {
        setSearchQuery("");
        setShowSearch(false);
      }}
      title="Close Search"
    >
      ✕
    </button>

  </div>
)}


      </header>
     {showPrivacyPolicy && (
  <div className="policy-overlay">
    <div className="policy-box">

      <button
        className="policy-close"
        onClick={() => setShowPrivacyPolicy(false)}
      >
        ✕
      </button>

      <h1>Privacy Policy</h1>

      <p>
        At SEHGAL GROUP, we respect your privacy and are committed
        to protecting your personal information.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect information such as your name, email address,
        mobile number, delivery address and order details when you
        create an account or place an order.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        Your information may be used to process orders, provide
        customer support, communicate with you and improve our
        services.
      </p>

      <h2>Payment Information</h2>
      <p>
        Payment information is processed through the applicable
        payment service provider. SEHGAL GROUP does not intentionally
        store sensitive payment details such as card passwords or PINs.
      </p>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect your personal
        information from unauthorized access or misuse.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy,
        please contact SEHGAL GROUP through our Contact Us section.
      </p>

    </div>
  </div>
)}
{showTerms && (
  <div className="policy-overlay">
    <div className="policy-box">

      <button
        className="policy-close"
        onClick={() => setShowTerms(false)}
      >
        ✕
      </button>

      <h1>Terms & Conditions</h1>

      <p>
        By using the SEHGAL GROUP website, you agree to
        the following terms and conditions.
      </p>

      <h2>Use of Website</h2>
      <p>
        You agree to use this website only for lawful purposes
        and provide accurate information while creating an account
        or placing an order.
      </p>

      <h2>Products and Pricing</h2>
      <p>
        Product prices, availability and descriptions may change
        from time to time. SEHGAL GROUP reserves the right to
        update product information when required.
      </p>

      <h2>Orders</h2>
      <p>
        Orders are subject to product availability and successful
        order confirmation. We reserve the right to cancel an order
        in certain circumstances.
      </p>

      <h2>Payments</h2>
      <p>
        Payment options available on the website will be displayed
        during checkout.
      </p>

      <h2>Delivery</h2>
      <p>
        Delivery times may vary depending on the delivery location,
        product availability and other circumstances.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions regarding these Terms & Conditions,
        please contact SEHGAL GROUP through our Contact Us section.
      </p>

    </div>
  </div>
)}
{showShippingPolicy && (
  <div className="policy-overlay">
    <div className="policy-box">

      <button
        className="policy-close"
        onClick={() => setShowShippingPolicy(false)}
      >
        ✕
      </button>

      <h1>Shipping Policy</h1>

      <p>
        SEHGAL GROUP aims to deliver your orders safely and
        conveniently to the address provided during checkout.
      </p>

      <h2>Order Processing</h2>
      <p>
        Orders are processed after successful order confirmation.
        Processing time may vary depending on product availability
        and order details.
      </p>

      <h2>Delivery Time</h2>
      <p>
        Delivery time may vary depending on your location,
        product availability and other delivery conditions.
      </p>

      <h2>Delivery Address</h2>
      <p>
        Customers are responsible for providing a correct and
        complete delivery address, mobile number and pincode.
      </p>

      <h2>Delivery Delays</h2>
      <p>
        Delivery may occasionally be delayed due to weather,
        transportation issues, holidays or other circumstances
        beyond our control.
      </p>

      <h2>Damaged or Incorrect Order</h2>
      <p>
        If you receive a damaged, missing or incorrect product,
        please contact SEHGAL GROUP as soon as possible through
        our Contact Us section.
      </p>

      <h2>Contact Us</h2>
      <p>
        For any shipping-related questions, please contact
        SEHGAL GROUP through our Contact Us section.
      </p>

    </div>
  </div>
)}
{showReturnPolicy && (
  <div className="policy-overlay">
    <div className="policy-box">

      <button
        className="policy-close"
        onClick={() => setShowReturnPolicy(false)}
      >
        ✕
      </button>

      <h1>Return & Refund Policy</h1>

      <p>
        SEHGAL GROUP wants you to have a satisfactory shopping
        experience. If there is an issue with your order or product,
        please contact us as soon as possible.
      </p>

      <h2>Return Eligibility</h2>
      <p>
        Products may be eligible for return if they are damaged,
        defective or incorrect. Return eligibility may depend on
        the condition of the product and the circumstances of the order.
      </p>

      <h2>Return Request</h2>
      <p>
        Customers should contact SEHGAL GROUP through the Contact Us
        section to report a return or product-related issue.
      </p>

      <h2>Refunds</h2>
      <p>
        If a refund is approved, the refund amount and method will
        depend on the applicable payment method and order details.
      </p>

      <h2>Damaged or Incorrect Products</h2>
      <p>
        If you receive a damaged or incorrect product, please contact
        us promptly with the relevant order details.
      </p>

      <h2>Non-Returnable Products</h2>
      <p>
        Certain products may not be eligible for return due to their
        nature, usage or hygiene considerations.
      </p>

      <h2>Contact Us</h2>
      <p>
        For return or refund questions, please contact SEHGAL GROUP
        through our Contact Us section.
      </p>

    </div>
  </div>
)}














      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-content">

          <p className="small-title">
            SEHGAL GROUP
          </p>

          <h1>
            Clean Home.
            <br />
            <span>Happy Life.</span>
          </h1>

          <p className="hero-text">
            Powerful cleaning products for a cleaner,
            fresher and healthier home.
          </p>

          <button
            className="shop-btn"
            onClick={() =>
              document
                .getElementById("shop")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            SHOP NOW →
          </button>

        </div>

        <div className="hero-product">

          <img
            src={dishwashImg}
            alt="SEHGAL GROUP Dishwash"
          />

        </div>

      </section>


      {/* ================= PRODUCTS ================= */}

      <section className="products" id="shop">

        <div className="section-heading">

          <p>OUR PRODUCTS</p>

          <h2>Cleaning Products</h2>

        </div>


        <div className="product-grid">
        {searchQuery && products.filter((product) =>
  product.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase())
).length === 0 && (
  <div className="no-search-results">
    <h3>No products found</h3>
    <p>
      We couldn't find any product matching "{searchQuery}".
    </p>
  </div>
)}
          {products
  .filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
  .map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              <div className="sale">
                SALE
              </div>

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

              </div>

              <h3>
                {product.name}
              </h3>

              <p className="product-desc">
                {product.desc}
              </p>

              <div className="price">

                <span className="old-price">
                  ₹{product.oldPrice}
                </span>

                <strong>
                  ₹{product.price}
                </strong>

              </div>
{product.stock > 0 ? (
  <p className="stock-available">
    In Stock: {product.stock}
  </p>
) : (
  <p className="stock-out">
    Out of Stock
  </p>
)}
<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }}
  disabled={product.stock <= 0}
>
  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
</button>

            </div>

          ))}

        </div>

      </section>


      {/* ================= WHY US ================= */}
{/* ================= ABOUT US ================= */}

<section className="about-section" id="about">

  <div className="about-content">

    <div className="about-text">

      <p className="about-label">
        ABOUT SEHGAL GROUP
      </p>

      <h2>
        Cleaning Made Simple.
        <br />
        <span>Life Made Better.</span>
      </h2>

      <p>
        SEHGAL GROUP is focused on providing reliable,
        affordable and effective cleaning products for
        everyday homes and businesses.
      </p>

      <p>
        From dishwash liquids and detergents to floor,
        bathroom, toilet and glass cleaners, we aim to
        make everyday cleaning easier and more convenient.
      </p>

      <div className="about-points">

        <div>
          <strong>✓ Quality</strong>
          <span>Reliable products for everyday cleaning.</span>
        </div>

        <div>
          <strong>✓ Affordable</strong>
          <span>Quality cleaning at reasonable prices.</span>
        </div>

        <div>
          <strong>✓ Customer First</strong>
          <span>Your satisfaction is our priority.</span>
        </div>

      </div>

    </div>

    <div className="about-card">

      <div className="about-icon">
        🧼
      </div>

      <h3>
        SEHGAL GROUP
      </h3>

      <p>
        Clean Home. Happy Life.
      </p>

    </div>

  </div>

</section>


      {/* ================= FOOTER ================= */}
{/* ================= CONTACT ================= */}

<section className="contact-section" id="contact">

  <div className="contact-content">

    <div className="contact-info">

      <p className="contact-label">
        GET IN TOUCH
      </p>

      <h2>
        We’re Here to
        <br />
        <span>Help You.</span>
      </h2>

      <p className="contact-description">
        Have a question about our products, orders or
        delivery? Feel free to get in touch with
        SEHGAL GROUP.
      </p>

      <div className="contact-details">

        <div className="contact-item">
          <div className="contact-icon">📞</div>
          <div>
            <strong>Phone</strong>
            <p>+91 XXXXX XXXXX</p>
          </div>
        </div>

        <div className="contact-item">
          <div className="contact-icon">✉️</div>
          <div>
            <strong>Email</strong>
            <p>support@sehgalgroup.com</p>
          </div>
        </div>

        <div className="contact-item">
          <div className="contact-icon">📍</div>
          <div>
            <strong>Location</strong>
            <p>India</p>
          </div>
        </div>

      </div>

    </div>

<div className="contact-card">

  <h3>Send Us a Message</h3>

  <input
    type="text"
    placeholder="Your Name"
    value={contactForm.name}
    onChange={(e) =>
      setContactForm({
        ...contactForm,
        name: e.target.value,
      })
    }
  />

  <input
    type="email"
    placeholder="Your Email"
    value={contactForm.email}
    onChange={(e) =>
      setContactForm({
        ...contactForm,
        email: e.target.value,
      })
    }
  />

  <input
    type="text"
    placeholder="Phone Number"
    value={contactForm.phone}
    onChange={(e) =>
      setContactForm({
        ...contactForm,
        phone: e.target.value,
      })
    }
  />

  <textarea
    placeholder="Your Message"
    rows="5"
    value={contactForm.message}
    onChange={(e) =>
      setContactForm({
        ...contactForm,
        message: e.target.value,
      })
    }
  ></textarea>

  <button
    type="button"
    disabled={contactLoading}
    onClick={async () => {
      if (
        !contactForm.name ||
        !contactForm.email ||
        !contactForm.message
      ) {
        alert("Please fill Name, Email and Message.");
        return;
      }

      try {
        setContactLoading(true);

        const response = await fetch(
          "https://sehgal-group-backend.onrender.com/api/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contactForm),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send message.");
        }

        alert("Message sent successfully!");

        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } catch (error) {
        alert(error.message);
      } finally {
        setContactLoading(false);
      }
    }}
  >
    {contactLoading ? "SENDING..." : "SEND MESSAGE →"}
  </button>

</div>

  </div>

</section>
{/* ================= FOOTER ================= */}

<footer className="final-footer">

  <div className="footer-main">

    <div className="footer-brand">
      <h2>SEHGAL GROUP</h2>

      <p>
        Quality cleaning products for a cleaner,
        fresher and happier home.
      </p>
    </div>

    <div className="footer-column">
      <h3>Quick Links</h3>

      <a href="#home">Home</a>
      <a href="#shop">Shop</a>
      <a href="#about">About Us</a>
      <a href="#contact">Contact</a>
    </div>

    <div className="footer-column">
      <h3>Customer Support</h3>

      <a href="#contact">Order Support</a>
      <button
  type="button"
  onClick={() => setShowShippingPolicy(true)}
>
  Shipping Information
</button>
      <button
  type="button"
  onClick={() => setShowReturnPolicy(true)}
>
  Return & Refund
</button>
      <a href="#contact">Contact Us</a>
    </div>

    <div className="footer-column">
      <h3>Contact</h3>

      <p>📞 +91 XXXXX XXXXX</p>
      <p>✉️ support@sehgalgroup.com</p>
      <p>📍 India</p>
    </div>

  </div>

  <div className="footer-bottom">

    <p>© 2026 SEHGAL GROUP. All Rights Reserved.</p>

    <div className="footer-legal">

      <button
        type="button"
        onClick={() => setShowPrivacyPolicy(true)}
      >
        Privacy Policy
      </button>

<button
  type="button"
  onClick={() => setShowTerms(true)}
>
  Terms & Conditions
</button>

    </div>

  </div>

</footer>

      {/* ================= CART ================= */}

      {showCart && (

        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)}
        >

          <div
            className="cart-box"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="cart-header">

              <h2>
                Your Cart
              </h2>

              <button
                className="close-cart"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>

            </div>


            {cart.length === 0 ? (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add some cleaning products to your cart.
                </p>

                <button
                  onClick={() => {
                    setShowCart(false);

                    setTimeout(() => {
                      document
                        .getElementById("shop")
                        .scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Continue Shopping
                </button>

              </div>

            ) : (

              <>

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cart-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <strong>
                          ₹{item.price}
                        </strong>

                        <div className="quantity">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <button
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  ))}

                </div>


                <div className="cart-footer">

                  <div className="cart-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{totalPrice}
                    </strong>

                  </div>

 <button
  type="button"
  className="checkout-btn"
  onClick={() => {
    setShowCart(false);
    setShowCheckout(true);
  }}
  >
  Proceed to Checkout
 </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}
     {/* ================= CHECKOUT ================= */}

 {showCheckout && (
  <div className="checkout-overlay">

    <div className="checkout-box">

      <div className="checkout-header">
        <h2>Checkout</h2>

        <button
          className="close-checkout"
          onClick={() => setShowCheckout(false)}
        >
          ✕
        </button>
      </div>


      <div className="checkout-content">

        {/* CUSTOMER DETAILS */}

        <div className="checkout-details">

          <h3>Delivery Details</h3>

          <input
            type="text"
            placeholder="Full Name"
          />
<input
  type="text"
  placeholder="Full Name"
  value={customer.name}
  onChange={(e) =>
    setCustomer({ ...customer, name: e.target.value })
  }
/>
<input
  type="tel"
  placeholder="Mobile Number"
  value={customer.mobile}
  onChange={(e) =>
    setCustomer({ ...customer, mobile: e.target.value })
  }
/>
<textarea
  placeholder="Full Address"
  rows="4"
  value={customer.address}
  onChange={(e) =>
    setCustomer({ ...customer, address: e.target.value })
  }
></textarea>
          <div className="checkout-row">

<input
  type="text"
  placeholder="City"
  value={customer.city}
  onChange={(e) =>
    setCustomer({ ...customer, city: e.target.value })
  }
/>
<input
  type="text"
  placeholder="PIN Code"
  value={customer.pincode}
  onChange={(e) =>
    setCustomer({ ...customer, pincode: e.target.value })
  }
/>

          </div>

         {orderError && (
  <div
    style={{
      color: "#b91c1c",
      background: "#fee2e2",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontSize: "14px",
    }}
  >
    {orderError}
  </div>
)}
          <h3 className="payment-title">
            Payment Method
          </h3>


          <label className="payment-option">

<input
  type="radio"
  name="payment"
  value="COD"
  checked={paymentMethod === "COD"}
  onChange={(e) => setPaymentMethod(e.target.value)}
/>

            <span>
              Cash on Delivery
            </span>

          </label>


          <label className="payment-option">

<input
  type="radio"
  name="payment"
  value="ONLINE"
  checked={paymentMethod === "ONLINE"}
  onChange={(e) => setPaymentMethod(e.target.value)}
/>

            <span>
              Online Payment
            </span>

          </label>


<button
  type="button"
  className="place-order-btn"
  onClick={handlePlaceOrder}
  disabled={placingOrder}
>
  {placingOrder ? "Placing Order..." : "Place Order"}
</button>

        </div>


        {/* ORDER SUMMARY */}

        <div className="order-summary">

          <h3>
            Order Summary
          </h3>


          {cart.map((item) => (

            <div
              className="summary-item"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div>

                <h4>
                  {item.name}
                </h4>

                <p>
                  Quantity: {item.quantity}
                </p>

              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>

            </div>

          ))}


          <div className="summary-line">
            <span>Subtotal</span>
            <strong>₹{totalPrice}</strong>
          </div>


          <div className="summary-line">
            <span>Delivery</span>
            <strong>FREE</strong>
          </div>


          <div className="summary-total">
            <span>Total</span>
            <strong>₹{totalPrice}</strong>
          </div>

        </div>

      </div>

    </div>

  </div>
)}
{showOrders && (
  <div
    className="orders-overlay"
    onClick={() => setShowOrders(false)}
  >
    <div
      className="orders-box"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="orders-header">
        <h2>My Orders</h2>

        <button
          className="close-orders"
          onClick={() => setShowOrders(false)}
        >
          ✕
        </button>
      </div>

      {loadingOrders ? (
        <div className="orders-loading">
          Loading orders...
        </div>
      ) : myOrders.length === 0 ? (
        <div className="no-orders">
          <div>📦</div>
          <h3>No Orders Yet</h3>
          <p>Your orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">


          {myOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="order-status">
                  {order.orderStatus}
                </span>
                {order.orderStatus !== "CANCELLED" && (
  <div className="order-progress">
    <span className={order.orderStatus === "PLACED" ? "active" : ""}>
      Placed
    </span>

    <span className={order.orderStatus === "PROCESSING" ? "active" : ""}>
      Processing
    </span>

    <span className={order.orderStatus === "SHIPPED" ? "active" : ""}>
      Shipped
    </span>

    <span className={order.orderStatus === "DELIVERED" ? "active" : ""}>
      Delivered
    </span>
  </div>
)}
              </div>

              <div className="order-products">
                {order.items.map((item, index) => (
                  <div
                    className="order-product"
                    key={index}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <span>
                  Payment: {order.paymentMethod}
                </span>

                <strong>
                  Total: ₹{order.totalAmount}
                </strong>
                {order.orderStatus === "PLACED" && (
  <button
    type="button"
    onClick={() => handleCancelOrder(order._id)}
  >
    Cancel Order
  </button>
)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
{orderPlaced && (
  <div className="success-overlay">
    <div className="success-box">

      <div className="success-icon">✓</div>

      <h2>Order Placed Successfully!</h2>

      <p>
        Thank you for shopping with SEHGAL GROUP.
      </p>

      <p className="order-message">
        Your order has been received successfully.
      </p>

      <button
        type="button"
        className="continue-btn"
        onClick={() => {
          setOrderPlaced(false);
          setShowCheckout(false);
          setCart([]);
        }}
      >
        Continue Shopping
      </button>

    </div>
  </div>
)}


    </div>
  );
}

export default App;


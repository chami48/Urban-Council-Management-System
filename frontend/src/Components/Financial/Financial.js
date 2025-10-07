import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, FileText, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, XCircle, Download, Search, Filter, Menu, X } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const Financial = () => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch payment stats
  useEffect(() => {
    fetchStats();
    fetchPayments();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/stats");
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats([]);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/payment/all");
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Failed to load payment data. Please check if the backend server is running.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const getStatusData = () => {
    if (!stats || !Array.isArray(stats)) return [];
    return stats.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.totalAmount,
      count: item.count
    }));
  };

  const getPaymentTypeData = () => {
    if (!Array.isArray(payments) || payments.length === 0) return [];
    const typeMap = {};
    payments.forEach(payment => {
      const type = payment.paymentType || 'other';
      if (!typeMap[type]) {
        typeMap[type] = { type, amount: 0, count: 0 };
      }
      typeMap[type].amount += payment.amount || 0;
      typeMap[type].count += 1;
    });
    return Object.values(typeMap).map(item => ({
      name: item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      amount: item.amount,
      count: item.count
    }));
  };

  const getMonthlyData = () => {
    if (!Array.isArray(payments) || payments.length === 0) return [];
    const monthMap = {};
    payments.forEach(payment => {
      const date = new Date(payment.paymentDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, amount: 0, count: 0 };
      }
      monthMap[monthKey].amount += payment.amount || 0;
      monthMap[monthKey].count += 1;
    });
    return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  };

  const getTotalRevenue = () => {
    if (!Array.isArray(payments)) return 0;
    return payments.reduce((sum, payment) => {
      if (payment.status === 'completed') {
        return sum + (payment.amount || 0);
      }
      return sum;
    }, 0);
  };

  const getPendingAmount = () => {
    if (!Array.isArray(payments)) return 0;
    return payments.reduce((sum, payment) => {
      if (payment.status === 'pending') {
        return sum + (payment.amount || 0);
      }
      return sum;
    }, 0);
  };

  const getCompletedCount = () => {
    if (!Array.isArray(payments)) return 0;
    return payments.filter(p => p.status === 'completed').length;
  };

  // Filter payments
  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    const matchesSearch = 
      payment.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.nicNumber?.includes(searchTerm) ||
      payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || payment.paymentType === filterType;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }) : [];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#ec4899'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString('en-IN') || 0}`;
  };

  const exportToCSV = () => {
    const headers = ['Receipt Number', 'Date', 'Name', 'NIC', 'Type', 'Amount', 'Status'];
    const rows = filteredPayments.map(p => [
      p.receiptNumber,
      new Date(p.paymentDate).toLocaleDateString(),
      p.applicantName,
      p.nicNumber,
      p.paymentType,
      p.amount,
      p.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Urban Council</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Citizens</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white transition-colors">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Finance</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Services</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Reports</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Inventory</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
                <p className="text-sm text-gray-500">Horana Urban Council</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search across all modules..."
                  className="pl-10 pr-4 py-2 w-80 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Stats Cards with Gradient */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">+12.5%</span>
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold">{formatCurrency(getTotalRevenue())}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">+8.2%</span>
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Completed Payments</h3>
                <p className="text-3xl font-bold">{getCompletedCount()}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">Pending</span>
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Pending Amount</h3>
                <p className="text-3xl font-bold">{formatCurrency(getPendingAmount())}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full">Total</span>
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Total Transactions</h3>
                <p className="text-3xl font-bold">{payments.length}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Payment Type Distribution */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getPaymentTypeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {getPaymentTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Status Overview */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Status Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="url(#colorGradient)" name="Revenue" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, NIC, or receipt number..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="shop_rent">Shop Rent</option>
                <option value="property_tax">Property Tax</option>
                <option value="license_fee">License Fee</option>
                <option value="penalty">Penalty</option>
                <option value="other">Other</option>
              </select>
              <select
                className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={exportToCSV}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Receipt #</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No payments found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {payment.receiptNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.applicantName}</div>
                          <div className="text-sm text-gray-500">{payment.nicNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700">
                            {payment.paymentType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.shopName && <div>Shop: {payment.shopName}</div>}
                          {payment.propertyNo && <div>Property: {payment.propertyNo}</div>}
                          {payment.year && payment.quarter && <div>Q{payment.quarter}/{payment.year}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <span className="text-sm font-medium capitalize">{payment.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Financial;
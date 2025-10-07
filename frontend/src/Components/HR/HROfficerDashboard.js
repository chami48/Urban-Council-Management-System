import React from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, CalendarDays } from "lucide-react";
import Nav from "../Navigation/Navigation";

const HROfficerDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: "salary",
      title: "Salary Management",
      titleSinhala: "වැටුප් කළමනාකරණය",
      description: "Manage salary details, payslips, increments and payroll updates.",
      icon: DollarSign,
      color: "green",
      route: "/salary-table",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
    },
    {
      id: "leaveHandling",
      title: "Leave Handling",
      titleSinhala: " නිවාඩු කළමනාකරණය",
      description: "Track staff leave requests, approvals, and balances efficiently.",
      icon: CalendarDays,
      color: "purple",
      route: "/leavestatus",
      gradient: "from-purple-400 via-pink-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Nav />
      <main className="transition-all duration-300 ml-20 md:ml-72 p-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
          Officer Dashboard – <span className="text-green-600">Salary</span> &{" "}
          <span className="text-purple-600">Leave Handling</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.route)}
              className="relative group cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
            >
              {/* Animated gradient border */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500`}
              ></div>

              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/40 rounded-2xl p-8 shadow-lg overflow-hidden">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}
                >
                  <card.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {card.titleSinhala}
                </p>

                {/* Description */}
                <p className="text-gray-500 text-base leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all bg-gradient-to-r ${card.gradient} hover:shadow-xl hover:scale-[1.02]`}
                >
                  Open Module →
                </button>

                {/* Subtle background glow */}
                <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HROfficerDashboard;

// import React from "react";

// const page = () => {
//   return <div>dsjio</div>;
// };

// export default page;



// app/offers/page.jsx

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            આજના ખાસ ઓફર્સ
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            તમારા food business માટે smart offers – વધુ orders, વધુ customers
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Offer Card 1 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Flat 20% Discount
            </h3>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>✔ પસંદગીના menu items પર</li>
              <li>✔ Limited time offer</li>
              <li>✔ Auto-apply at checkout</li>
            </ul>
          </div>

          {/* Offer Card 2 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Buy 1 Get 1 Free
            </h3>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>✔ Weekend special</li>
              <li>✔ Customer retention માટે perfect</li>
              <li>✔ Dashboard થી easy control</li>
            </ul>
          </div>

          {/* Offer Card 3 */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Free Add-on Offer
            </h3>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>✔ ₹499 થી વધુ order પર</li>
              <li>✔ Free beverage / item</li>
              <li>✔ Average order value વધારવા માટે best</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <button className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition">
            હમણાં Activate કરો
          </button>
        </div>

      </div>
    </div>
  );
}

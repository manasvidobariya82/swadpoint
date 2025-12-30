import { Star, Link2 } from "lucide-react";

export default function Header() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Store Link */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-1">Store Link</h3>
        <p className="text-sm text-gray-500 mb-2">
          Share your web store’s link
        </p>

        <div className="flex items-center gap-2 text-blue-600">
          <Link2 size={16} />
          <a href="#">https://swadpoint.myfoodiv.com</a>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold">Rating</h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-2xl font-bold">0.0</span>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} className="text-gray-300" />
          ))}
        </div>

        <a href="#" className="text-blue-600 text-sm mt-1 inline-block">
          See all reviews
        </a>
      </div>
    </div>
  );
}

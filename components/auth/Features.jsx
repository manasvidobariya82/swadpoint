const features = [
  { title: "Online Ordering", desc: "Accept & manage orders seamlessly." },
  { title: "Menu Management", desc: "Update items & prices instantly." },
  { title: "Analytics", desc: "Track sales & customer behavior." },
  {
    title: "Multi-Outlet Support",
    desc: "Control all outlets from one panel.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Grow
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

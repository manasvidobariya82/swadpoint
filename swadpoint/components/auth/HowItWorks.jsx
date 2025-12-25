export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-xl">1. Register</h3>
            <p className="text-gray-600 mt-2">
              Create your restaurant profile.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">2. Manage</h3>
            <p className="text-gray-600 mt-2">Add menu & manage orders.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl">3. Grow</h3>
            <p className="text-gray-600 mt-2">Increase sales with insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

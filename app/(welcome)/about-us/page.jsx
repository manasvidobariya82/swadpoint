"use client";

import { useState, useEffect } from "react";

const AboutUs = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    clients: 0,
    projects: 0,
    years: 0,
    rating: 0,
  });

  // Animate numbers on scroll
  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById("stats-section");
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
          const animateNumber = (target, duration, key) => {
            let start = 0;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                start = target;
                clearInterval(timer);
              }
              setAnimatedNumbers((prev) => ({
                ...prev,
                [key]: Math.floor(start),
              }));
            }, 16);
          };

          animateNumber(500, 2000, "clients");
          animateNumber(1200, 2000, "projects");
          animateNumber(8, 2000, "years");
          animateNumber(4.9, 2000, "rating");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "manasvi dobariya",
      role: "CEO & Founder",
      bio: "Visionary leader with 15+ years in food tech industry, passionate about revolutionizing dining experiences through technology.",
      expertise: ["Business Strategy", "Food Technology", "Innovation"],
      image:
        "https://sp.yimg.com/ib/th/id/OIP.uknAVpsYtOcwXQqBo7oKPAHaFS?pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
    },
    {
      id: 2,
      name: "kirti dhameliya",
      role: "CTO",
      bio: "Tech genius specializing in AR/VR and mobile applications. Former lead developer at major tech companies.",
      expertise: ["AR/VR Development", "Mobile Apps", "Cloud Architecture"],
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "laxi gajera",
      role: "Head of Design",
      bio: "Award-winning designer with focus on user experience and interface design for food industry applications.",
      expertise: ["UI/UX Design", "3D Modeling", "Brand Identity"],
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      name: "krinal donga",
      role: "Customer Success Director",
      bio: "Dedicated professional with hospitality background ensuring every restaurant partner achieves success.",
      expertise: ["Customer Support", "Training", "Relationship Management"],
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly push boundaries to create cutting-edge solutions that transform the dining experience.",
      icon: "💡",
    },
    {
      title: "Excellence",
      description:
        "Every detail matters. We're committed to delivering the highest quality in everything we do.",
      icon: "⭐",
    },
    {
      title: "Partnership",
      description:
        "We work hand-in-hand with restaurants to understand their unique needs and challenges.",
      icon: "🤝",
    },
    {
      title: "Sustainability",
      description:
        "We develop eco-friendly solutions that reduce waste and promote sustainable practices.",
      icon: "🌱",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-cyan-100/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              SwadPoint
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            We're on a mission to transform the restaurant industry through
            innovative technology that creates unforgettable dining experiences.
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-medium">
            <span>🎯 Our Mission:</span>
            <span className="font-semibold">
              Redefining Dining with Technology
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                value: animatedNumbers.clients,
                label: "Happy Clients",
                suffix: "+",
                color: "text-blue-600",
              },
              {
                value: animatedNumbers.projects,
                label: "Projects Completed",
                suffix: "+",
                color: "text-cyan-600",
              },
              {
                value: animatedNumbers.years,
                label: "Years Experience",
                suffix: "",
                color: "text-indigo-600",
              },
              {
                value: animatedNumbers.rating,
                label: "Customer Rating",
                suffix: "/5",
                color: "text-emerald-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div
                  className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-blue-600">Story</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg leading-relaxed">
                  Founded in 2025, SwadPoint began as a simple idea: to bridge
                  the gap between traditional dining experiences and modern
                  technology. Our founder, Aarav Sharma, noticed how restaurants
                  were struggling to keep up with digital transformation.
                </p>
                <p className="text-lg leading-relaxed">
                  What started as a small team of passionate developers and food
                  enthusiasts has grown into a leading food tech company serving
                  hundreds of restaurants across multiple countries.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we're proud to be at the forefront of restaurant
                  technology, combining artificial intelligence, augmented
                  reality, and data analytics to create solutions that benefit
                  both restaurants and their customers.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-1">
                <div className="bg-white rounded-2xl p-6">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Vision 2026
                      </h3>
                      <p className="text-gray-600">
                        To be the global leader in restaurant technology
                        innovation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-600">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The brilliant minds driving innovation at SwadPoint
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <button
                key={member.id}
                onClick={() => setActiveTeamMember(index)}
                className={`text-left bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                  activeTeamMember === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="relative mb-6">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {member.role}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {member.expertise.slice(0, 2).map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Active Member Details */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {teamMembers[activeTeamMember].name}
                </h3>
                <p className="text-blue-600 font-semibold mb-4">
                  {teamMembers[activeTeamMember].role}
                </p>
                <p className="text-gray-600 mb-6">
                  {teamMembers[activeTeamMember].bio}
                </p>
                <div className="flex flex-wrap gap-3">
                  {teamMembers[activeTeamMember].expertise.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium shadow-sm"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-1">
                  <img
                    src={teamMembers[activeTeamMember].image}
                    alt={teamMembers[activeTeamMember].name}
                    className="w-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UPDATED FOOTER ================= */}
      <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-24 pb-10 relative overflow-hidden">
        {/* Soft Background Glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-bold text-cyan-400 mb-5">
                SwadPoint 🍽️
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Delivering delicious food with innovation and technology.
                Experience taste like never before.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                {["Home", "Features", "Plan", "About Us"].map((item, i) => (
                  <li
                    key={i}
                    className="hover:text-cyan-400 cursor-pointer transition-colors duration-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li>📍 Surat, Gujarat</li>
                <li>📞 +91 98765 43210</li>
                <li>📧 support@swadpoint.com</li>
                <li>🕒 10 AM – 11 PM</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Stay Updated</h4>
              <p className="text-gray-400 mb-6">
                Subscribe to get latest offers and exclusive discounts.
              </p>

              <div className="flex overflow-hidden rounded-full border border-white/20">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 bg-white/10 text-sm focus:outline-none w-full"
                />
                <button className="px-6 bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold hover:opacity-90 transition-all">
                  Subscribe
                </button>
              </div>

              {/* Payment Icons */}
              <div className="flex gap-4 mt-6 text-gray-400 text-xl"></div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SwadPoint. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;

"use client";

import { useState, useEffect } from "react";

const CareerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [stats, setStats] = useState({
    innovators: 0,
    restaurants: 0,
    models: 0,
    rating: 0,
  });

  // Animate stats counter
  useEffect(() => {
    const targetStats = {
      innovators: 150,
      restaurants: 100,
      models: 50000,
      rating: 4.9,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        innovators: Math.min(
          targetStats.innovators,
          Math.floor(targetStats.innovators * (step / steps))
        ),
        restaurants: Math.min(
          targetStats.restaurants,
          Math.floor(targetStats.restaurants * (step / steps))
        ),
        models: Math.min(
          targetStats.models,
          Math.floor(targetStats.models * (step / steps))
        ),
        rating: parseFloat((targetStats.rating * (step / steps)).toFixed(1)),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Job Categories
  const jobCategories = [
    {
      id: "all",
      name: "All Roles",
      icon: "💼",
      count: 24,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "ar-vr",
      name: "AR Culinary",
      icon: "👓",
      count: 6,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "tech",
      name: "Food AI",
      icon: "🤖",
      count: 8,
      color: "from-blue-500 to-teal-500",
    },
    {
      id: "design",
      name: "3D Gastronomy",
      icon: "🎨",
      count: 4,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "product",
      name: "Flavor Tech",
      icon: "📱",
      count: 3,
      color: "from-rose-500 to-pink-500",
    },
    {
      id: "creative",
      name: "Culinary AR",
      icon: "✨",
      count: 3,
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Job Locations
  const locations = [
    { id: "all", name: "All Locations" },
    { id: "remote", name: "Remote" },
    { id: "hybrid", name: "Hybrid" },
    { id: "bangalore", name: "Bangalore, India" },
    { id: "mumbai", name: "Mumbai, India" },
    { id: "delhi", name: "Delhi, India" },
    { id: "global", name: "Global Remote" },
  ];

  // Job Listings
  const jobListings = [
    {
      id: 1,
      title: "AR Food Experience Engineer",
      department: "AR Culinary",
      category: "ar-vr",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      salary: "₹35-55 LPA",
      posted: "2 days ago",
      vacancies: 2,
      description:
        "Create magical AR dining experiences where virtual garnishes dance on real plates and interactive menus tell culinary stories.",
      requirements: [
        "Unity/Unreal Engine",
        "ARKit/ARCore Expertise",
        "Spatial Computing",
        "Real-time 3D",
      ],
      isFeatured: true,
      isUrgent: true,
      categoryColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
      icon: "✨",
    },
    {
      id: 2,
      title: "3D Culinary Digital Artist",
      department: "3D Gastronomy",
      category: "design",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹20-35 LPA",
      posted: "1 week ago",
      vacancies: 2,
      description:
        "Craft photorealistic 3D food models so realistic, they'll make taste buds tingle.",
      requirements: [
        "Blender/Maya Mastery",
        "Food Photography Eye",
        "Texture Wizardry",
        "Culinary Passion",
      ],
      isFeatured: true,
      isUrgent: false,
      categoryColor: "bg-gradient-to-r from-amber-50 to-orange-50",
      icon: "🍕",
    },
    {
      id: 3,
      title: "Food AI Vision Scientist",
      department: "Food AI",
      category: "tech",
      location: "Hybrid",
      type: "Full-time",
      experience: "4+ years",
      salary: "₹32-48 LPA",
      posted: "3 days ago",
      vacancies: 1,
      description:
        "Teach AI to understand food better than a master chef. Build systems that recognize dishes and estimate nutrition.",
      requirements: [
        "Computer Vision",
        "TensorFlow/PyTorch",
        "Food Recognition Models",
        "Real-time Inference",
      ],
      isFeatured: false,
      isUrgent: true,
      categoryColor: "bg-gradient-to-r from-teal-50 to-green-50",
      icon: "🧠",
    },
    {
      id: 4,
      title: "AR Menu Experience Designer",
      department: "Culinary AR",
      category: "creative",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹18-28 LPA",
      posted: "1 week ago",
      vacancies: 2,
      description:
        "Design AR menus where dishes float off the page, ingredients tell their stories, and restaurant ambiance comes alive.",
      requirements: [
        "Figma/Sketch Pro",
        "Spatial UX Design",
        "Motion Design",
        "User Psychology",
      ],
      isFeatured: false,
      isUrgent: false,
      categoryColor: "bg-gradient-to-r from-emerald-50 to-green-50",
      icon: "📱",
    },
  ];

  // Company Culture
  const companyCulture = [
    {
      title: "Spice of Innovation",
      description: "We add AR magic to every culinary experience",
      icon: "🌶️",
    },
    {
      title: "Family Feast",
      description: "Collaborate like a well-coordinated kitchen brigade",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      title: "Fresh Ingredients",
      description: "Always learning, always growing, never stale",
      icon: "🌱",
    },
    {
      title: "Recipe of Integrity",
      description: "Authentic flavors, transparent practices",
      icon: "🤝",
    },
  ];

  // Company Benefits
  const companyBenefits = [
    {
      title: "Flavored Compensation",
      description: "Industry-topping salaries with taste-based bonuses",
      icon: "💰",
      color: "bg-green-50",
    },
    {
      title: "Taste Equity",
      description: "ESOPs - own a piece of the food tech revolution",
      icon: "💎",
      color: "bg-purple-50",
    },
    {
      title: "Global Kitchen",
      description: "Work from anywhere - your kitchen to a Parisian café",
      icon: "🏠",
      color: "bg-blue-50",
    },
    {
      title: "Culinary Education",
      description: "Annual ₹75K for food tech courses & chef masterclasses",
      icon: "🎓",
      color: "bg-amber-50",
    },
  ];

  // Employee Testimonials
  const testimonials = [
    {
      name: "Chef Rohan Mehra",
      role: "AR Culinary Director",
      quote:
        "At SwadPoint, I get to play with digital spices and virtual flames. We're creating a new language of dining where technology speaks the dialect of flavor.",
      rating: 5,
      department: "Culinary Innovation",
      highlight: "Designed 200+ AR-enhanced dishes",
    },
    {
      name: "Dr. Ananya Verma",
      role: "Food AI Researcher",
      quote:
        "We're teaching computers to understand Indian cuisine's complexity - from recognizing 50 types of biryani to suggesting perfect raita pairings.",
      rating: 5,
      department: "AI Research",
      highlight: "Built India's largest food recognition dataset",
    },
    {
      name: "Aarav Sharma",
      role: "3D Food Sculptor",
      quote:
        "I make virtual food so realistic, your phone might get greasy. Seeing people's reactions when butter chicken sizzles in AR is my daily dose of joy.",
      rating: 5,
      department: "Digital Gastronomy",
      highlight: "Created 1000+ hyper-realistic food models",
    },
  ];

  // Tech Stack
  const techStack = [
    {
      name: "Unity 3D",
      description: "AR Food Rendering",
      color: "from-purple-600 to-indigo-600",
      icon: "🎮",
    },
    {
      name: "ARKit/ARCore",
      description: "Mobile Food AR",
      color: "from-blue-600 to-cyan-600",
      icon: "📱",
    },
    {
      name: "Three.js",
      description: "Web Food 3D",
      color: "from-amber-600 to-orange-500",
      icon: "🔶",
    },
    {
      name: "TensorFlow",
      description: "Food Recognition AI",
      color: "from-green-600 to-emerald-500",
      icon: "⚡",
    },
  ];

  // Filter jobs
  const filteredJobs = jobListings.filter((job) => {
    if (activeCategory !== "all" && job.category !== activeCategory)
      return false;

    if (locationFilter !== "all" && job.location !== locationFilter) {
      if (
        locationFilter === "remote" &&
        !job.location.toLowerCase().includes("remote")
      )
        return false;
      if (
        locationFilter === "hybrid" &&
        !job.location.toLowerCase().includes("hybrid")
      )
        return false;
    }

    if (
      searchQuery &&
      !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Simple job card
  const JobCard = ({ job }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        job.isFeatured ? "border-2 border-blue-300" : ""
      }`}
    >
      {job.isFeatured && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-t-2xl text-sm font-semibold">
          ⭐ Featured Role
        </div>
      )}
      {job.isUrgent && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold">
          ⚡ Immediate Joining
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${job.categoryColor}`}>
                <span className="text-lg">{job.icon}</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {job.department}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {job.title}
            </h3>
          </div>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
            {job.salary}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span>📍</span>
            <span className="text-gray-700">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>⏰</span>
            <span className="text-gray-700">{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>📅</span>
            <span className="text-gray-700">{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>👥</span>
            <span className="text-gray-700">{job.vacancies} opening(s)</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{job.description}</p>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Skills Required:
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">Posted {job.posted}</div>
          <button
            onClick={() => alert(`Applying for: ${job.title}`)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-md"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 text-gray-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 px-4 py-2 rounded-full mb-6 shadow-sm">
              <span className="text-sm font-semibold text-blue-700">
                🚀 Pioneering the Future of Food Experience with AR
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Build the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Digital Dining
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              At <span className="font-bold text-blue-700">SwadPoint</span>,
              we're creating immersive AR dining experiences that transform how
              people interact with food.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("job-listings")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
              >
                View Open Positions
              </button>
            </div>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="relative -mb-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stats.innovators}+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Culinary Innovators
                </div>
              </div>
              <div className="bg-white border border-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stats.restaurants}+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Partner Restaurants
                </div>
              </div>
              <div className="bg-white border border-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stats.models.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  3D Food Models
                </div>
              </div>
              <div className="bg-white border border-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stats.rating}★
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Chef Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Technology Stack
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We use cutting-edge technologies to build immersive AR food
              experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, idx) => (
              <div key={idx} className="group">
                <div
                  className={`bg-gradient-to-br ${tech.color} rounded-xl p-6 text-white text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                >
                  <div className="text-3xl mb-3">{tech.icon}</div>
                  <div className="font-bold text-lg mb-1">{tech.name}</div>
                  <div className="text-sm opacity-90">{tech.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <div id="job-listings" className="py-16 bg-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Career Opportunities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our team of innovators working at the intersection of food,
              technology, and creativity
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400">
                    🔍
                  </div>
                  <input
                    type="text"
                    placeholder="Search by skills, role, or keyword..."
                    className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <select
                className="p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 mt-6 pb-2">
              {jobCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r " +
                        category.color +
                        " text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-blue-50 border border-blue-100"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeCategory === category.id
                        ? "bg-white/20"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-blue-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No matching roles found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Company Culture Section */}
      <div className="py-16 bg-gradient-to-b from-white to-blue-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Workplace Culture
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating an environment where innovation thrives and
              creativity flourishes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {companyCulture.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group hover:-translate-y-2"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Employee Benefits
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We invest in your growth, well-being, and professional development
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${benefit.color} border border-transparent hover:border-blue-200`}
              >
                <div className="text-2xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Testimonials */}
      <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Team Member Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear directly from innovators who are shaping the future of food
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
              >
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <div className="text-blue-600 font-semibold text-sm">
                    {testimonial.role}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {"★".repeat(testimonial.rating)}
                  </div>
                </div>

                <blockquote className="mt-4 text-gray-700 text-sm italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-blue-700">
                    {testimonial.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">SP</span>
                </div>
                <h3 className="text-xl font-bold">SwadPoint</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Pioneering the future of food experience through augmented
                reality and culinary innovation.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span>📧</span>
                  <span>careers@swadpoint.com</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span>📍</span>
                  <span>Bangalore, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="text-gray-400 text-sm text-center">
              © 2024 SwadPoint. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40 hover:scale-110"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default CareerPage;

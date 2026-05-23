function FeaturesSection() {
  const features = [
    {
      icon: '✓',
      title: 'Verified Properties',
      description: 'All listings are verified for your safety',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: '📍',
      title: 'Prime Locations',
      description: 'Properties in the best locations of Mohali',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: '💰',
      title: 'Affordable Prices',
      description: 'Find options that fit your budget',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'We\'re here to help you anytime',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

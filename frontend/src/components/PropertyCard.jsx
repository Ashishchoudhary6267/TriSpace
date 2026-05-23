import { useState } from 'react';

function PropertyCard({ property, onFavoriteClick, isFavorite, onDetailsClick }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105">
      {/* Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden group">
        {!imageError && property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-4xl">🏠</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
          {property.type || 'FLAT'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteClick(property._id)}
          className="absolute top-4 right-4 text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <button
            onClick={() => onDetailsClick(property)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
          {property.title || property.name || 'Property'}
        </h3>

        <div className="flex items-center text-gray-600 mb-4 text-sm">
          <span className="mr-2">📍</span>
          <span className="truncate">{property.location || 'Mohali'}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 text-xs font-semibold mb-1">BHK</p>
            <p className="text-lg font-bold text-gray-900">{property.bhk || '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs font-semibold mb-1">SIZE</p>
            <p className="text-lg font-bold text-gray-900">{property.size || '-'} sqft</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs font-semibold mb-1">TYPE</p>
            <p className="text-lg font-bold text-gray-900">{property.type || 'FLAT'}</p>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Rent per month</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{property.price?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <button
            onClick={() => onDetailsClick(property)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;

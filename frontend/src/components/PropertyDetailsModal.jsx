import React from 'react';

function PropertyDetailsModal({ property, onClose }) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100 z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50/30 flex justify-between items-center">
          <div>
            <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {property.type}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 mt-2 leading-tight">{property.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-600 flex-1">
          
          {/* Image Gallery */}
          {(property.images?.length > 0 || property.image) && (
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
              {(property.images?.length > 0 ? property.images : [property.image]).map((img, idx) => {
                const imgUrl = img?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${img}` : img;
                return (
                  <img 
                    key={idx} 
                    src={imgUrl} 
                    alt={`${property.title} - ${idx + 1}`} 
                    className="w-64 h-48 object-cover rounded-xl flex-shrink-0 snap-center shadow-sm border border-gray-200"
                  />
                );
              })}
            </div>
          )}

          {/* Price & Address Card */}
          <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Rent</p>
              <p className="text-3xl font-black text-green-600 mt-1">₹{property.monthlyRent}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">📍 Location</p>
              <p className="font-bold text-slate-700 mt-1">{property.address.sectorOrPhase}</p>
              <p className="text-sm text-slate-500 font-medium">{property.address.city}</p>
            </div>
          </div>

          {/* Electricity & Utilities */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">⚡ Utilities & Charges</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${property.electricity?.isIncluded ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
                <span className="text-xs font-semibold text-slate-500">Electricity status</span>
                <span className={`font-extrabold text-sm mt-2 ${property.electricity?.isIncluded ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {property.electricity?.isIncluded ? 'Included in Rent ✅' : 'Charged Separately 🔌'}
                </span>
              </div>
              {!property.electricity?.isIncluded && property.electricity?.perUnitRate && (
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500">Electricity Rate</span>
                  <span className="font-extrabold text-slate-800 text-sm mt-2">
                    ₹{property.electricity.perUnitRate} / Unit
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rules & Guidelines */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">🏡 House Rules</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Gender Permitted</span>
                <span className="font-extrabold text-indigo-700 text-sm mt-2">
                  🙋‍♂️ {property.rules?.genderAllowed || 'Anyone'}
                </span>
              </div>
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${property.rules?.hasCurfew ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                <span className="text-xs font-semibold text-slate-500">Curfew Restriction</span>
                <span className={`font-extrabold text-sm mt-2 ${property.rules?.hasCurfew ? 'text-red-700' : 'text-emerald-700'}`}>
                  ⏰ {property.rules?.hasCurfew ? 'Curfew Enforced' : 'No Curfew Rules'}
                </span>
              </div>
            </div>
          </div>

          {/* Landlord Contact Details */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">📞 Landlord Contact Details</h4>
            {property.owner ? (
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 p-5 rounded-2xl border border-blue-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Owner Name</span>
                  <span className="font-bold text-slate-800">{property.owner.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Email Address</span>
                  <a href={`mailto:${property.owner.email}`} className="font-semibold text-blue-600 hover:underline text-sm">
                    {property.owner.email}
                  </a>
                </div>
                {property.owner.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Phone Number</span>
                    <a href={`tel:${property.owner.phone}`} className="font-bold text-indigo-600 hover:underline text-sm">
                      {property.owner.phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No landlord information provided.</p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-slate-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold hover:bg-gray-50 active:scale-95 transition cursor-pointer text-center"
          >
            Close Details
          </button>
          {property.owner?.phone && (
            <a 
              href={`https://wa.me/${property.owner.phone.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl text-center hover:bg-emerald-700 active:scale-95 transition shadow-md shadow-emerald-100"
            >
              WhatsApp Landlord 💬
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

export default PropertyDetailsModal;

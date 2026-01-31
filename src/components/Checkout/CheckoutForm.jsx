import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import config from '../../config';
import { X, CreditCard, MapPin, User, Phone, Mail, FileText, Gift, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CheckoutForm({ onBack, onSuccess, appliedCoupon }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    notes: '',
    giftWrap: false,
    giftMessage: ''
  });

  const subtotal = getCartTotal();
  const calculateShipping = (city) => {
    if (!city) return 200;
    const c = String(city).toLowerCase();
    return c === 'karachi' ? 200 : 250;
  };
  const shippingCost = calculateShipping(formData.city);
  const giftWrapCost = formData.giftWrap ? 120 : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const total = Math.max(0, subtotal + shippingCost + giftWrapCost - discountAmount);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        shippingCost,
        giftWrapCost,
        total,
        giftWrap: formData.giftWrap,
        giftMessage: formData.giftMessage,
        requestId,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };

      const API_BASE_URL = config.api.baseUrl;
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.status === 503) {
        setError('Service temporarily unavailable. Please try again later.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const data = await response.json();
      clearCart();
      onSuccess(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pakistanCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl my-4 md:my-8 transform transition-all flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="font-fashion-serif text-3xl italic font-black text-black tracking-tighter">Checkout</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-1">Review & Confirm Order</p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label="Close checkout"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-12">
          {error && (
            <div className="bg-gray-50 border border-gray-100 text-black px-6 py-4 flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Order Failed</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <User size={18} strokeWidth={1.5} className="text-gray-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all"
                  placeholder="Full Name *"
                />
              </div>
              <div className="relative group">
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all"
                  placeholder="Phone Number *"
                />
              </div>
            </div>
            <div className="relative group">
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all"
                placeholder="Email Address (Optional)"
              />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <MapPin size={18} strokeWidth={1.5} className="text-gray-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">Shipping Address</h3>
            </div>
            <div className="space-y-8">
              <div className="relative group">
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all resize-none"
                  placeholder="Complete Delivery Address *"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select City *</option>
                    {pakistanCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-gray-400 italic">
                    Shipping: {formData.city === 'Karachi' ? '200' : '250'} PKR
                  </p>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all"
                    placeholder="Postal Code (Optional)"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Order Notes & Gift Wrap */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <FileText size={18} strokeWidth={1.5} className="text-gray-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">Special Requests</h3>
            </div>

            <div className="relative group">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="1"
                className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none text-sm font-medium transition-all resize-none"
                placeholder="Order Notes (Optional)"
              />
            </div>

            <div className="bg-gray-50 p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="relative flex items-center h-5">
                  <input
                    type="checkbox"
                    id="giftWrap"
                    name="giftWrap"
                    checked={formData.giftWrap}
                    onChange={handleChange}
                    className="w-5 h-5 border-2 border-gray-200 rounded-sm text-black focus:ring-0 cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="giftWrap" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black cursor-pointer flex items-center gap-3">
                    Add Gift Wrapping
                    <span className="text-gray-400 font-medium tracking-normal text-[10px]">+ {config.currency.symbol} 120</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Beautiful packaging and personal note included.</p>
                </div>
              </div>

              {formData.giftWrap && (
                <div className="animate-fadeIn pt-4">
                  <textarea
                    name="giftMessage"
                    value={formData.giftMessage}
                    onChange={handleChange}
                    rows="2"
                    maxLength="200"
                    className="w-full px-4 py-4 bg-white border border-gray-100 focus:border-black outline-none text-sm font-medium transition-all resize-none italic"
                    placeholder="Enter your personalized gift message here..."
                  />
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest text-right">
                    {formData.giftMessage.length}/200
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Order Summary */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <CreditCard size={18} strokeWidth={1.5} className="text-gray-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">Order Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-widest">
                <span>Items ({cartItems.length})</span>
                <span className="font-fashion-sans text-black">{config.currency.symbol} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-widest">
                <span>Shipping</span>
                <span className="font-fashion-sans text-black">{config.currency.symbol} {shippingCost.toLocaleString()}</span>
              </div>
              {formData.giftWrap && (
                <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  <span>Gift Wrap</span>
                  <span className="font-fashion-sans text-black">{config.currency.symbol} {giftWrapCost.toLocaleString()}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="text-black font-fashion-sans">-{config.currency.symbol} {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">Grand Total</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-black font-fashion-sans">
                    {config.currency.symbol} {total.toLocaleString()}
                  </span>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mt-1">Payment: Cash On Delivery</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Submit */}
          <div className="sticky bottom-0 bg-white -mx-8 px-8 py-8 border-t border-gray-100 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-4 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Purchase</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
            >
              Return To Bag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

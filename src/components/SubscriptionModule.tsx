import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Wallet, 
  Check, 
  Zap, 
  Shield, 
  Star, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Smartphone,
  Building2
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import axios from 'axios';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  credits: number;
  features: string[];
  popular?: boolean;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan (Basic)',
    price: 0,
    duration: 'month',
    credits: 200,
    color: 'slate',
    features: [
      '200 credits per month',
      'Automatic renewal every month',
      'Credits do not carry over',
      'Meal analysis (5 credits/image)',
      'Smart health assistant (1 credit/message)',
      'Experience basic features'
    ]
  },
  {
    id: 'monthly',
    name: 'Fitness Plan (Monthly)',
    price: 299,
    duration: 'month',
    credits: 1200,
    color: 'emerald',
    features: [
      '1200 credits per month',
      'Credits do not carry over',
      'Unlimited meal analysis (5 credits/image)',
      'Smart health assistant (1 credit/message)',
      'Premium technical support'
    ]
  },
  {
    id: 'quarterly',
    name: 'Beast Plan (3 Months)',
    price: 749,
    duration: '3 months',
    credits: 4000,
    popular: true,
    color: 'blue',
    features: [
      '4000 credits per month',
      'Credits do not carry over',
      'Save 150 EGP',
      'All monthly plan features',
      'Detailed monthly progress reports'
    ]
  },
  {
    id: 'annual',
    name: 'Hero Plan (Yearly)',
    price: 2499,
    duration: 'year',
    credits: 18000,
    color: 'purple',
    features: [
      '18,000 credits per month',
      'Credits do not carry over',
      'Best value for money',
      'Huge savings (40%)',
      'Private consultations with advanced AI'
    ]
  }
];

interface SubscriptionModuleProps {
  language: 'en' | 'ar';
  user: any;
  onUpdate: (u: any) => void;
}

export const SubscriptionModule: React.FC<SubscriptionModuleProps> = ({ language, user, onUpdate }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(PLANS[2]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'fawry'>('card');
  const [walletNumber, setWalletNumber] = useState('');
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const handleSubscribe = async () => {
    if (!user || !selectedPlan) return;
    
    // For free plan, just activate it directly
    if (selectedPlan.price === 0) {
      setLoading(true);
      try {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 100);
        const updates = {
          subscriptionType: 'free',
          subscriptionExpiry: expiryDate.toISOString(),
          subscriptionStartDate: new Date().toISOString(),
          lastResetDate: new Date().toISOString(),
          credits: selectedPlan.credits
        };
        await updateDoc(doc(db, 'users', user.uid), updates);
        onUpdate({ ...user, ...updates });
      } catch (err) {
        console.error(err);
        setError('Failed to activate free plan');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 0. Get Paymob Config
      const configRes = await axios.get('/api/paymob/config');
      const config = configRes.data;

      if (!config.isConfigured) {
        throw new Error('Payment system is not configured yet. Please ensure PAYMOB_API_KEY is set in secrets.');
      }

      // 1. Authenticate with server to get Paymob token
      const authRes = await axios.post('/api/paymob/authenticate');
      const token = authRes.data.token;

      // 2. Register Order
      const orderRes = await axios.post('/api/paymob/order', {
        token,
        amount: selectedPlan.price,
        userId: user.uid,
        items: [
          {
            name: selectedPlan.name,
            amount_cents: Math.round(selectedPlan.price * 100),
            description: `Subscription to ${selectedPlan.name}`,
            quantity: 1
          }
        ]
      });
      const orderId = orderRes.data.orderId;

      // 3. Get Payment Key
      let integrationId;
      if (paymentMethod === 'card') integrationId = config.integrationIdCard; 
      else if (paymentMethod === 'wallet') integrationId = config.integrationIdWallet;
      else integrationId = config.integrationIdFawry;

      if (!integrationId) {
        throw new Error('This payment method is not available currently (Integration ID missing)');
      }

      const keyRes = await axios.post('/api/paymob/payment-key', {
        token,
        orderId,
        amount: selectedPlan.price,
        integrationId,
        billingData: {
          first_name: user.displayName?.split(' ')[0] || 'User',
          last_name: user.uid,
          email: user.email || 'user@example.com',
          phone_number: walletNumber || '01000000000',
          apartment: 'NA',
          floor: 'NA',
          street: 'NA',
          building: 'NA',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'Cairo',
          country: 'Egypt',
          state: 'Cairo'
        }
      });

      const paymentKey = keyRes.data.paymentKey;

      // 4. Redirect to Paymob Iframe or Wallet URL
      if (paymentMethod === 'card') {
        const iframeId = config.iframeId; 
        if (!iframeId) throw new Error('Iframe ID is missing');
        window.location.href = `https://egypt.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
      } else if (paymentMethod === 'wallet') {
        const walletRes = await axios.post('https://egypt.paymob.com/api/acceptance/payments/pay', {
          source: {
            identifier: walletNumber,
            subtype: 'WALLET'
          },
          payment_token: paymentKey
        });
        window.location.href = walletRes.data.redirect_url;
      } else if (paymentMethod === 'fawry') {
        const fawryRes = await axios.post('https://egypt.paymob.com/api/acceptance/payments/pay', {
          source: {
            identifier: 'fawry',
            subtype: 'FAWRY'
          },
          payment_token: paymentKey
        });
        alert(`Please pay at Fawry using code: ${fawryRes.data.data.bill_reference}`);
      }

    } catch (err: any) {
      console.error('Subscription Error:', err);
      const serverError = err.response?.data?.error || err.response?.data?.details?.message || err.message;
      setError(serverError || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  if (!isChangingPlan && user.subscriptionType && user.subscriptionType !== 'free' && new Date(user.subscriptionExpiry) > new Date()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-[40px] p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200 rotate-3">
              <Shield className="text-white" size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Your Subscription is Active!
            </h2>
            <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto">
              You are currently enjoying the {PLANS.find(p => p.id === user.subscriptionType)?.name} features. Your balance is {user.credits} credits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-left">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Remaining Balance</p>
                <p className="text-3xl font-black text-emerald-600">{user.credits?.toLocaleString()} <span className="text-sm">Credits</span></p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-left">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Renewal Date</p>
                <p className="text-xl font-black text-slate-900">{new Date(user.subscriptionExpiry).toLocaleDateString('en-US')}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setIsChangingPlan(true);
                setSelectedPlan(null);
              }}
              className="rounded-2xl px-8 py-3 border border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors"
            >
              Change Plan or Upgrade
            </button>
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="text-center mb-16 relative">
        {isChangingPlan && (
          <button 
            onClick={() => setIsChangingPlan(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowRight className="rotate-180" size={20} />
            Back to my subscription
          </button>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Choose Your Success Plan
        </h1>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
          Invest in your health with our flexible plans. Our credit system ensures you only pay for what you use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-[40px] border-2 transition-all cursor-pointer flex flex-col ${
              selectedPlan?.id === plan.id 
                ? 'border-emerald-500 bg-emerald-50/30' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                <span className="text-slate-500 text-xs font-bold">EGP / {plan.duration}</span>
              </div>
            </div>

            <div className="bg-slate-100/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-emerald-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Credit Balance</p>
                  <p className="text-lg font-black text-slate-900">{plan.credits.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="text-emerald-500 shrink-0 mt-1" size={14} />
                  <span className="text-slate-600 text-xs font-medium leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <div className={`w-full py-4 rounded-2xl font-bold text-center transition-all ${
              selectedPlan?.id === plan.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {selectedPlan?.id === plan.id 
                ? 'Selected' 
                : 'Select Plan'}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-slate-900 rounded-[50px] p-8 md:p-16 text-white relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl font-black mb-10">
                  Complete Subscription
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Choose Payment Method</p>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                          paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <CreditCard size={24} className={paymentMethod === 'card' ? 'text-emerald-400' : 'text-slate-400'} />
                        <span className="text-[10px] font-bold uppercase">Card</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                          paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <Smartphone size={24} className={paymentMethod === 'wallet' ? 'text-emerald-400' : 'text-slate-400'} />
                        <span className="text-[10px] font-bold uppercase">Wallet</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('fawry')}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                          paymentMethod === 'fawry' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <Building2 size={24} className={paymentMethod === 'fawry' ? 'text-emerald-400' : 'text-slate-400'} />
                        <span className="text-[10px] font-bold uppercase">Fawry</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'wallet' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-bold">
                        Wallet Number (Vodafone Cash, etc.)
                      </label>
                      <input 
                        type="tel" 
                        value={walletNumber}
                        onChange={e => setWalletNumber(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-lg font-bold"
                      />
                    </motion.div>
                  )}

                  <button
                    onClick={handleSubscribe}
                    disabled={loading || (paymentMethod === 'wallet' && !walletNumber)}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-white py-6 rounded-[24px] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-500/20"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        {selectedPlan.price === 0 ? 'Activate Now' : `Pay ${selectedPlan.price} EGP`}
                        <ArrowRight size={24} />
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="flex items-center gap-3 text-rose-400 text-sm bg-rose-400/10 p-4 rounded-2xl border border-rose-400/20">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-3xl flex items-center justify-center">
                      <Shield className="text-emerald-400" size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Secure Payment</h4>
                      <p className="text-sm text-slate-400">Encrypted processing by Paymob</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Selected Plan</span>
                      <span className="text-xl font-black">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Credits</span>
                      <span className="text-xl font-black text-emerald-400">{selectedPlan.credits.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10 my-6" />
                    <div className="flex justify-between items-end">
                      <span className="text-slate-400 font-medium mb-1">Total Amount</span>
                      <div className="text-right">
                        <span className="text-5xl font-black text-white">{selectedPlan.price}</span>
                        <span className="text-sm text-slate-400 ml-2 font-bold">EGP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
            <Shield size={24} />
          </div>
          <h4 className="font-bold text-slate-900">Data Protection</h4>
          <p className="text-xs text-slate-500 leading-relaxed">We use the highest encryption standards to protect your personal and financial data.</p>
        </div>
        <div className="space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
            <Zap size={24} />
          </div>
          <h4 className="font-bold text-slate-900">Instant Activation</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Your subscription is activated and credits are added to your account immediately after payment.</p>
        </div>
        <div className="space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
            <Star size={24} />
          </div>
          <h4 className="font-bold text-slate-900">24/7 Support</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Our support team is ready to help you anytime via chat or email.</p>
        </div>
      </div>
    </div>
  );
};

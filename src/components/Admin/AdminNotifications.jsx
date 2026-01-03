import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, AlertCircle, ShoppingBag, Info, ShieldAlert } from 'lucide-react';
import config from '../../config';
import { toast } from 'sonner';

// API Base URL - Consistent with other Admin components
const API_BASE_URL = config.api.baseUrl;

// Helper for generic API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    };

    // Construct full URL if API_BASE_URL is present, otherwise use relative
    const baseUrl = API_BASE_URL ? `${API_BASE_URL}/api/notifications` : '/api/notifications';

    const res = await fetch(`${baseUrl}/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

const AdminNotifications = () => {
    const [settings, setSettings] = useState({
        enableEmailNotifications: true,
        enablePushNotifications: true,
        notificationEmails: []
    });
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [pushStatus, setPushStatus] = useState('unknown'); // 'subscribed', 'unsubscribed', 'denied'

    useEffect(() => {
        fetchSettings();
        checkPushStatus();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await apiCall('settings');
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
            toast.error('Failed to load notification settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await apiCall('settings', 'PUT', settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const addEmail = () => {
        if (!newEmail) return;
        if (!newEmail.includes('@')) return toast.error('Invalid email');
        if (settings.notificationEmails.includes(newEmail)) return toast.error('Email already added');

        setSettings(prev => ({
            ...prev,
            notificationEmails: [...prev.notificationEmails, newEmail]
        }));
        setNewEmail('');
    };

    const removeEmail = (email) => {
        setSettings(prev => ({
            ...prev,
            notificationEmails: prev.notificationEmails.filter(e => e !== email)
        }));
    };

    // --- PUSH NOTIFICATION LOGIC ---

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const checkPushStatus = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setPushStatus('unsupported');
            return;
        }
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) setPushStatus('subscribed');
        else if (Notification.permission === 'denied') setPushStatus('denied');
        else setPushStatus('unsubscribed');
    };

    const subscribeToPush = async () => {
        try {
            if (pushStatus === 'denied') {
                return toast.error('Notifications blocked. Please enable them in browser settings.');
            }

            const reg = await navigator.serviceWorker.ready;

            // Get VAPID key
            const { publicKey } = await apiCall('vapid-key');

            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            });

            // Send to backend
            await apiCall('subscribe', 'POST', sub);

            toast.success('This device is now subscribed to Order Alerts!');
            setPushStatus('subscribed');
        } catch (error) {
            console.error('Push subscription failed:', error);
            toast.error('Failed to subscribe to push notifications');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-playfair font-black text-white mb-2 italic tracking-tight uppercase">Alert Matrix</h2>
                    <p className="text-slate-500 font-medium tracking-wide">Configure real-time event propagation and neural hooks</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/5 hover:bg-emerald-600/20 transition-all active:scale-95 group"
                >
                    <Save size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                    Synchronize Cluster
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Email Settings */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-inner">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic tracking-tight uppercase">SMTP Relay</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Order event broadcasting</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group/toggle">
                            <input
                                type="checkbox"
                                checked={settings.enableEmailNotifications}
                                onChange={() => toggleSetting('enableEmailNotifications')}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-slate-800 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-600 after:rounded-full after:h-[19px] after:w-[19px] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600 peer-checked:after:bg-white shadow-inner" />
                        </label>
                    </div>

                    {settings.enableEmailNotifications && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Propagation Nodes</label>
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                                        placeholder="node@cluster.mesh"
                                        className="flex-1 px-5 py-3.5 bg-black/20 border border-white/5 rounded-2xl focus:border-indigo-500/50 focus:outline-none text-white font-medium placeholder:text-slate-700 transition-all"
                                    />
                                    <button
                                        onClick={addEmail}
                                        className="w-14 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {settings.notificationEmails.map(email => (
                                    <span key={email} className="flex items-center gap-3 pl-4 pr-2 py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl text-[11px] font-bold tracking-tight group/tag hover:bg-indigo-500/20 transition-all">
                                        {email}
                                        <button onClick={() => removeEmail(email)} className="p-1 hover:bg-rose-500/20 hover:text-rose-400 rounded-md transition-colors">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                {settings.notificationEmails.length === 0 && (
                                    <div className="w-full text-center py-6 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic">Zero distribution nodes active</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Push Settings */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-inner">
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Neural Hooks</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Direct device synchronization</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enablePushNotifications}
                                onChange={() => toggleSetting('enablePushNotifications')}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-slate-800 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-600 after:rounded-full after:h-[19px] after:w-[19px] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-teal-600 peer-checked:after:bg-white shadow-inner" />
                        </label>
                    </div>

                    <div className="space-y-6">
                        {pushStatus === 'subscribed' ? (
                            <div className="flex items-center gap-4 text-emerald-400 bg-emerald-500/10 px-6 py-5 rounded-3xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                <span className="text-[11px] font-black uppercase tracking-widest">Temporal Terminal Synchronized</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pushStatus === 'denied' && (
                                    <div className="flex items-center gap-3 text-rose-400 bg-rose-500/5 px-4 py-3 rounded-2xl border border-rose-500/10 text-[9px] font-black uppercase tracking-widest">
                                        <AlertCircle size={16} />
                                        <span>Permission Revoked: Reset Browser Tunnels</span>
                                    </div>
                                )}
                                <button
                                    onClick={subscribeToPush}
                                    disabled={!settings.enablePushNotifications || pushStatus === 'denied' || pushStatus === 'unsupported'}
                                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${settings.enablePushNotifications && pushStatus !== 'denied'
                                        ? 'bg-white text-black hover:bg-slate-200 shadow-xl'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    {pushStatus === 'unsupported' ? 'Hardware Incompatible' : 'Initialize Direct Link'}
                                    <Zap size={14} />
                                </button>
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-relaxed px-2 text-center">
                                    Synchronization required for every discrete temporal endpoint.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;

import { Mail, Smartphone, Save, Smartphone as SmartphoneIcon } from 'lucide-react';

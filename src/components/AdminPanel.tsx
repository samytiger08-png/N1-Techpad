import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Order } from '../types';
import { cn } from '../lib/utils';
import { LogOut, Package, Clock, CheckCircle, XCircle, Search, MapPin, Phone, Trash2, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';

const ADMIN_PASSWORD = "saidsamy";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(sessionStorage.getItem('admin_session') === 'true');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    document.title = "Admin Panel - Techpad";
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const initAdmin = async () => {
        try {
          // 1. Try to sign in anonymously if not already
          if (!auth.currentUser) {
            await signInAnonymously(auth);
          }
          
          // 2. Start listener only after auth
          const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
            setLoading(false);
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'orders');
            setError('Database access denied. Check security rules.');
            setLoading(false);
          });

          return unsubscribe;
        } catch (err: any) {
          console.error("Auth initialization failed:", err);
          if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
            setNeedsSetup(true);
          } else {
            setError(`Authentication failed: ${err.message}`);
          }
          setLoading(false);
        }
      };

      const unsubPromise = initAdmin();
      return () => {
        unsubPromise.then(unsub => unsub && unsub());
      };
    } else {
      setLoading(false);
    }
  }, [isAuthorized]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem('admin_session', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsAuthorized(false);
    sessionStorage.removeItem('admin_session');
    setPassword('');
  };

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteOrder = async (orderId: string) => {
    setDeletingId(orderId);
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      // No need to manually update state, onSnapshot will handle it
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
      setError('Failed to delete order. Please check your permissions.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm) ||
    order.wilaya.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-bento-bg p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-red-500 opacity-50"></div>
          
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-red-500 rounded-2xl shadow-xl shadow-red-500/20 flex items-center justify-center rotate-3">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-black mb-2 uppercase tracking-tight italic">Admin <span className="text-red-500">Dashboard</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">Restricted Access</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                placeholder="Secure Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono placeholder:text-gray-600 text-center"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-xs font-bold uppercase italic tracking-tight">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-gray-100 flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group"
            >
              Verify Access
            </button>
          </form>

          <div className="mt-10">
            <Link to="/" className="text-xs text-gray-600 hover:text-white uppercase tracking-widest font-black transition-colors decoration-dotted underline-offset-4 hover:underline">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-bento-bg p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-red-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-50"></div>
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black mb-4 uppercase tracking-tight text-center italic">Action <span className="text-red-500">Required</span></h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed text-center">
            To use password-only access, you must enable <strong>Anonymous Authentication</strong> in your Firebase Console.
          </p>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-4 mb-8">
            <div className="flex gap-4">
              <span className="w-6 h-6 flex-shrink-0 bg-red-500/20 text-red-500 text-xs font-bold rounded-full flex items-center justify-center">1</span>
              <p className="text-xs text-gray-300">Open <a href="https://console.firebase.google.com" target="_blank" className="text-cyan-400 underline h-8 inline-flex items-center">Firebase Console</a></p>
            </div>
            <div className="flex gap-4">
              <span className="w-6 h-6 flex-shrink-0 bg-red-500/20 text-red-500 text-xs font-bold rounded-full flex items-center justify-center">2</span>
              <p className="text-xs text-gray-300">Authentication → Sign-in method → Add new provider</p>
            </div>
            <div className="flex gap-4">
              <span className="w-6 h-6 flex-shrink-0 bg-red-500/20 text-red-500 text-xs font-bold rounded-full flex items-center justify-center">3</span>
              <p className="text-xs text-gray-300">Select <strong>Anonymous</strong>, enable it, and click Save</p>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
          >
            I've enabled it, let's go
          </button>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest font-black transition-colors">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Package className="text-red-600" />
              ORDERS DASHBOARD
            </h1>
            <p className="text-gray-500 mt-1">Manage mousepad orders efficiently</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white border text-gray-700 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="text-3xl font-black text-gray-900 mt-1">{orders.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">New Orders</span>
            <div className="text-3xl font-black text-red-600 mt-1">{orders.filter(o => o.status === 'new').length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 italic">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="text-3xl font-black text-green-600 mt-1">{orders.reduce((acc, o) => acc + o.productPrice, 0)} DA</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone or wilaya..."
              className="bg-transparent border-none outline-none w-full text-sm py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Delivery</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-xs font-semibold text-cyan-600 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded text-cyan-700">
                          {order.productName || "Mousepad"}
                        </span>
                        {order.color && (
                          <span className="bg-gray-100 border px-1.5 py-0.5 rounded text-gray-700">
                            {order.color}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                        <Phone size={12} className="text-gray-400" />
                        {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{order.wilaya} ({order.wilayaCode})</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />
                        {order.commune}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                        order.deliveryType === 'stopDeskEcommerce' ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                      )}>
                        {order.deliveryType === 'stopDeskEcommerce' ? 'Bureau' : 'Domicile'}
                      </div>
                      <div className="text-xs font-mono font-bold text-gray-400 mt-1">+{order.deliveryFee} DA</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-black text-gray-900 font-mono tracking-tighter">{order.finalTotal} DA</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id!, e.target.value as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none focus:ring-2 focus:ring-offset-2",
                          order.status === 'new' && "bg-red-100 text-red-700 focus:ring-red-500",
                          order.status === 'processing' && "bg-blue-100 text-blue-700 focus:ring-blue-500",
                          order.status === 'shipped' && "bg-amber-100 text-amber-700 focus:ring-amber-500",
                          order.status === 'delivered' && "bg-green-100 text-green-700 focus:ring-green-500",
                          order.status === 'cancelled' && "bg-gray-100 text-gray-700 focus:ring-gray-500",
                          order.status === 'ECHEC_01' && "bg-rose-100 text-rose-700 focus:ring-rose-500",
                        )}
                      >
                        <option value="new">Nouveau</option>
                        <option value="processing">Confirmée</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                        <option value="ECHEC_01">Échec 01</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      {order.createdAt?.toDate().toLocaleString() || 'Pending...'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => deleteOrder(order.id!)}
                         disabled={deletingId === order.id}
                         className={cn(
                           "p-2 transition-all group rounded-lg",
                           deletingId === order.id ? "opacity-50 cursor-not-allowed" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                         )}
                         title="Delete Order"
                       >
                         {deletingId === order.id ? (
                           <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                         ) : (
                           <Trash2 size={16} className="group-active:scale-90 transition-transform" />
                         )}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

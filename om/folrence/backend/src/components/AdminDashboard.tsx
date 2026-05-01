import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Filter, Calendar, Video, User, Clock,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Stethoscope,
  TrendingUp, Users, CalendarCheck, Trash2, ExternalLink, ChevronDown
} from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  patient: { name: string; email: string; phone: string; medicalNotes?: string };
  doctorId: string;
  doctorName: string;
  consultationType: string;
  date: string;
  timeSlot: string;
  meetLink?: string;
  calendarLink?: string;
  status: BookingStatus;
  createdAt?: string;
}

const API_BASE = '/.netlify/functions';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending:   { label: 'Pending',   color: 'amber',   icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'blue',    icon: CheckCircle },
  completed: { label: 'Completed', color: 'emerald', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'rose',    icon: XCircle    },
};

const STATUS_CLASSES: Record<string, string> = {
  amber:   'bg-amber-50 text-amber-700 border-amber-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rose:    'bg-rose-50 text-rose-700 border-rose-200',
};

const CONSULT_LABELS: Record<string, string> = {
  'in-person': 'In-Person',
  'video':     'Video',
  'follow-up': 'Follow-up',
  'emergency': 'Urgent',
};

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

function formatTime(t: string) { return t; }

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get-bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('admin_auth')) {
      navigate('/admin');
      return;
    }
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh, navigate]);

  const logout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setOpenStatusMenu(null);
    try {
      await fetch(`${API_BASE}/update-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await refresh();
    } catch (err) {
      console.error('Failed to update booking:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm(null);
    try {
      await fetch(`${API_BASE}/delete-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await refresh();
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => ({
    total:    bookings.length,
    today:    bookings.filter((b) => b.date === today).length,
    pending:  bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
  }), [bookings, today]);

  const filtered = useMemo(() => bookings.filter((b) => {
    const matchSearch =
      b.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      b.patient.email.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.doctorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  }), [bookings, search, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">Florence Hospital</div>
              <div className="text-[11px] text-slate-400">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors group"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <button
              onClick={logout}
              id="admin-logout-btn"
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-sm font-medium transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Appointment Management</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage all patient bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total,     icon: Users,         color: 'blue'    },
            { label: "Today's Slots",   value: stats.today,     icon: CalendarCheck, color: 'violet'  },
            { label: 'Pending Review',  value: stats.pending,   icon: AlertCircle,   color: 'amber'   },
            { label: 'Confirmed',       value: stats.confirmed, icon: TrendingUp,    color: 'emerald' },
          ].map((stat) => {
            const Icon = stat.icon;
            const gradients: Record<string,string> = {
              blue:    'from-blue-500 to-blue-400',
              violet:  'from-violet-500 to-violet-400',
              amber:   'from-amber-500 to-amber-400',
              emerald: 'from-emerald-500 to-emerald-400',
            };
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[stat.color]} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, booking ID, doctor…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="py-2.5 px-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-300 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No bookings found</p>
            <p className="text-slate-300 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => {
              const sc = STATUS_CONFIG[booking.status];
              const StatusIcon = sc.icon;
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left: Patient + Doctor */}
                    <div className="flex-1 grid sm:grid-cols-2 gap-4">
                      {/* Patient */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Patient</span>
                        </div>
                        <div className="font-bold text-slate-800 text-sm">{booking.patient.name}</div>
                        <div className="text-xs text-slate-500">{booking.patient.email}</div>
                        <div className="text-xs text-slate-500">{booking.patient.phone}</div>
                        {booking.patient.medicalNotes && (
                          <div className="mt-2 text-[11px] text-slate-400 bg-amber-50 px-2 py-1 rounded-lg max-w-[220px] truncate" title={booking.patient.medicalNotes}>
                            📋 {booking.patient.medicalNotes}
                          </div>
                        )}
                      </div>

                      {/* Appointment Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Appointment</span>
                        </div>
                        <div className="font-semibold text-slate-700 text-sm">{booking.doctorName}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {booking.consultationType === 'video' && <Video className="w-3 h-3 text-blue-400" />}
                          <span className="text-xs text-slate-500">{CONSULT_LABELS[booking.consultationType]}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          <span className="text-xs text-slate-500">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span className="text-xs text-slate-500 font-semibold">{formatTime(booking.timeSlot)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Meet link + Actions */}
                    <div className="flex flex-col gap-3 lg:items-end">
                      {/* Booking ID */}
                      <div className="font-mono text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">{booking.id}</div>

                      {/* Jitsi Meet Link */}
                      {booking.consultationType === 'video' && (
                        <a
                          href={booking.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors"
                          title={booking.meetLink}
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Jitsi Call
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {/* Calendar */}
                      <a
                        href={booking.calendarLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 text-xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Add to Calendar
                      </a>

                      {/* Status */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenStatusMenu(openStatusMenu === booking.id ? null : booking.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${STATUS_CLASSES[sc.color]}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {sc.label}
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        </button>

                        {openStatusMenu === booking.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-20 min-w-[160px] overflow-hidden">
                            {(Object.keys(STATUS_CONFIG) as BookingStatus[]).map((s) => {
                              const cfg = STATUS_CONFIG[s];
                              const SIcon = cfg.icon;
                              return (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(booking.id, s)}
                                  className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs font-medium hover:bg-slate-50 transition-colors ${booking.status === s ? 'bg-slate-50 font-bold' : ''}`}
                                >
                                  <SIcon className="w-3.5 h-3.5" />
                                  {cfg.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Delete */}
                      {deleteConfirm === booking.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-xs text-red-600 font-semibold hover:underline"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs text-slate-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(booking.id)}
                          className="flex items-center gap-1 text-slate-300 hover:text-red-400 text-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {openStatusMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenStatusMenu(null)} />
      )}
    </div>
  );
}

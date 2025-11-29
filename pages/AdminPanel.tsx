import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Icons } from '../components/icons';
import { User, Issue, Feedback } from '../types';
import { mockIssues } from '../data/mockData';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const AdminCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; trend?: string; trendUp?: boolean }> = ({ title, value, icon: Icon, color, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-3 opacity-10`}>
        <Icon className={`h-24 w-24 text-${color}-500`} />
    </div>
    <div className="relative z-10">
        <div className={`p-3 rounded-lg inline-block mb-4 bg-${color}-100`}>
             <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-end gap-2 mt-1">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {trend && (
                <span className={`text-xs font-medium mb-1 px-1.5 py-0.5 rounded ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trendUp ? '+' : ''}{trend}
                </span>
            )}
        </div>
    </div>
  </div>
);

const AdminPanel: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'shops' | 'issues'>('dashboard');
    
    // Data fetching
    const [users, setUsers] = useState<User[]>(() => {
        const storedUsers = JSON.parse(localStorage.getItem('dukaan-users') || '[]');
        return storedUsers.map((u: User) => ({
            ...u,
            shopName: u.shopName || `${u.name.split(' ')[0]}'s Store`,
            phone: u.phone || '+91 98765 43210',
            status: u.status || 'Active',
            lastActive: u.lastActive || new Date().toISOString()
        }));
    });
    const [issues, setIssues] = useState<Issue[]>(mockIssues);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
         return JSON.parse(localStorage.getItem('dukaan-feedback') || '[]');
    });

    // Dashboard Stats
    const totalShops = users.length;
    const activeShopsToday = Math.max(1, Math.floor(totalShops * 0.65));
    // Removed totalSalesEntries
    const totalExpenseEntries = 342;
    const errorRate = 1.2;

    const entryTypeData = [
        { name: 'Manual Entry', value: 65 },
        { name: 'Voice (Rush Mode)', value: 35 },
    ];
    const entryTypeColors = ['#3B82F6', '#8B5CF6'];
    const activityData = [
        { name: '09:00', sales: 40, voice: 10 },
        { name: '11:00', sales: 120, voice: 45 },
        { name: '13:00', sales: 90, voice: 30 },
        { name: '15:00', sales: 85, voice: 25 },
        { name: '17:00', sales: 150, voice: 80 },
        { name: '19:00', sales: 180, voice: 100 },
        { name: '21:00', sales: 60, voice: 20 },
    ];

    // Issue Tracker Logic
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
    const [adminNoteInput, setAdminNoteInput] = useState('');

    const handleStatusToggle = (userId: string) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
                return { ...u, status: newStatus };
            }
            return u;
        }));
    };

    const handleIssueStatusUpdate = (id: string, newStatus: Issue['status']) => {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    };

    const handleSaveNote = (id: string) => {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, adminNote: adminNoteInput } : i));
        setEditingIssueId(null);
        setAdminNoteInput('');
    };

    const openNoteEditor = (issue: Issue) => {
        setEditingIssueId(issue.id);
        setAdminNoteInput(issue.adminNote || '');
    };

    const filteredIssues = useMemo(() => {
        if (filterCategory === 'All') return issues;
        return issues.filter(i => i.category === filterCategory);
    }, [issues, filterCategory]);

    // Chart styles
    const tickColor = '#6B7280';
    const gridColor = '#E5E7EB';
    const tooltipStyle = { backgroundColor: '#FFFFFF', border: `1px solid #E5E7EB`, borderRadius: '0.5rem' };

    return (
        <div className="space-y-6 pb-10">
            {/* Header & Navigation */}
            <div className="flex justify-between items-center border-b pb-4 border-gray-200 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Command Center</h1>
                    <p className="text-sm text-gray-500 mt-1">Platform Overview & Management</p>
                </div>
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                     <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Icons.Activity className="inline-block w-4 h-4 mr-2" />
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('shops')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'shops' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Icons.Users className="inline-block w-4 h-4 mr-2" />
                        Shops
                    </button>
                    <button 
                        onClick={() => setActiveTab('issues')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'issues' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Icons.AlertOctagon className="inline-block w-4 h-4 mr-2" />
                        Feedback & Issues
                    </button>
                </div>
            </div>

            {/* --- TAB 1: DASHBOARD ANALYTICS --- */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AdminCard title="Total Shops" value={totalShops} icon={Icons.Users} color="blue" trend="12%" trendUp={true} />
                        <AdminCard title="Active Today" value={activeShopsToday} icon={Icons.Activity} color="green" trend="5%" trendUp={true} />
                        {/* Total Sales card removed */}
                        <AdminCard title="Total Expenses" value={totalExpenseEntries} icon={Icons.Expense} color="yellow" trend="Normal" trendUp={true} />
                        <AdminCard title="Error Rate" value={`${errorRate}%`} icon={Icons.AlertOctagon} color="red" trend="Stable" trendUp={true} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Input Analysis</h3>
                            <p className="text-xs text-gray-500 mb-6">Voice (Rush Mode) vs Manual</p>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={entryTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {entryTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entryTypeColors[index % entryTypeColors.length]} />))}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                             <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600"><span className="font-bold text-purple-500">35%</span> Voice Usage</p>
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Peak Activity</h3>
                            <p className="text-xs text-gray-500 mb-6">Entries per hour (Today)</p>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                        <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} cursor={{fill: '#F3F4F6'}} />
                                        <Legend />
                                        <Bar dataKey="sales" name="Manual" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="voice" name="Voice" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 2: SHOP REGISTRY --- */}
            {activeTab === 'shops' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Registered Shops</h3>
                        <span className="text-sm text-gray-500">Total: {users.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Shop Name</th>
                                    <th className="px-6 py-3">Owner</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Joined On</th>
                                    <th className="px-6 py-3">Last Active</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.filter(u => u.role !== 'admin').map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.shopName}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col">
                                                <span className="flex items-center"><Icons.Mail className="w-3 h-3 mr-1"/> {user.email}</span>
                                                <span className="flex items-center mt-1"><Icons.Phone className="w-3 h-3 mr-1"/> {user.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-500 flex items-center">
                                            <Icons.Clock className="w-3 h-3 mr-1 text-gray-400"/>
                                            {new Date(user.lastActive!).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleStatusToggle(user.id)}
                                                className={`text-xs font-bold px-3 py-1 rounded border ${user.status === 'Active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                            >
                                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB 3: FEEDBACK & BUGS --- */}
            {activeTab === 'issues' && (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* User Feedback Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">User Feedback</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {feedbacks.length > 0 ? feedbacks.map(fb => (
                                <div key={fb.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-800">{fb.userName}</span>
                                        <span className="text-sm text-gray-500">{fb.date}</span>
                                    </div>
                                    <div className="flex items-center my-1">
                                         {[1, 2, 3, 4, 5].map(r => (
                                            <Icons.Zap key={r} className={`h-4 w-4 ${fb.rating >= r ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                         ))}
                                    </div>
                                    <p className="text-gray-600 text-sm">{fb.comment}</p>
                                </div>
                            )) : (
                                <p className="p-6 text-center text-gray-500">No feedback submitted yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Issue Reports Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                         <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                            <h3 className="text-lg font-bold text-gray-800">Issue Reports</h3>
                            <div className="flex space-x-2">
                                {['All', 'Voice', 'Stock', 'Login', 'UI'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-3 py-1 text-xs rounded-full border ${filterCategory === cat ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            {filteredIssues.map(issue => (
                                <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                                                issue.category === 'Voice' ? 'bg-purple-100 text-purple-700' :
                                                issue.category === 'Stock' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {issue.category}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Icons.Calendar className="w-3 h-3 mr-1"/> {new Date(issue.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select 
                                                value={issue.status}
                                                onChange={(e) => handleIssueStatusUpdate(issue.id, e.target.value as any)}
                                                className={`text-xs font-bold border rounded px-2 py-1 focus:outline-none ${
                                                    issue.status === 'Resolved' ? 'text-green-600 border-green-200 bg-green-50' :
                                                    issue.status === 'Rejected' ? 'text-red-600 border-red-200 bg-red-50' :
                                                    issue.status === 'In-Progress' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                                                    'text-gray-600 border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In-Progress">In-Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">{issue.description}</h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                                <span className="flex items-center"><Icons.User className="w-3 h-3 mr-1"/> {issue.submittedBy}</span>
                                                <span className="flex items-center"><Icons.Mail className="w-3 h-3 mr-1"/> {issue.contact}</span>
                                                {issue.hasScreenshot && <span className="flex items-center text-blue-500 cursor-pointer hover:underline"><Icons.Image className="w-3 h-3 mr-1"/> View Screenshot</span>}
                                            </div>
                                        </div>
                                        
                                        <div className="w-1/3 bg-gray-50 rounded p-3 border border-gray-100">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-gray-500">ADMIN NOTES</span>
                                                {editingIssueId !== issue.id && (
                                                    <button onClick={() => openNoteEditor(issue)} className="text-xs text-blue-600 hover:underline">Edit</button>
                                                )}
                                            </div>
                                            
                                            {editingIssueId === issue.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <textarea 
                                                        className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                        rows={2}
                                                        value={adminNoteInput}
                                                        onChange={(e) => setAdminNoteInput(e.target.value)}
                                                        placeholder="Add internal note..."
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingIssueId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                                        <button onClick={() => handleSaveNote(issue.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Save</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-600 italic">{issue.adminNote || "No notes added."}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
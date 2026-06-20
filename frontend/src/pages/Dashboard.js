import React, { useState, useEffect } from 'react';
import { groupService, paymentService } from '../services/api';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { FiPlus, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalOwedToYou: 0,
    totalYouOwe: 0,
    totalSettled: 0
  });
  const [alert, setAlert] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', members: [] });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const groupsResponse = await groupService.getGroups();
      const groupsData = groupsResponse.data.groups || [];
      setGroups(groupsData);

      // Get current user ID from token
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      // Fetch all pending payments involving the user
      const paymentsResponse = await paymentService.getPendingPayments();
      const payments = paymentsResponse.data.payments || [];

      // Calculate stats
      let totalExpenses = 0;
      let totalOwedToYou = 0; // People owe you
      let totalYouOwe = 0;   // You owe people

      // Total expenses across all groups
      for (let group of groupsData) {
        totalExpenses += group.totalAmount || 0;
      }

      // Calculate debt vs credit
      for (let payment of payments) {
        if (payment.to._id === userId || payment.to === userId) {
          totalOwedToYou += payment.amount;
        } else if (payment.from._id === userId || payment.from === userId) {
          totalYouOwe += payment.amount;
        }
      }

      setStats({
        totalExpenses,
        totalOwedToYou,
        totalYouOwe,
        totalSettled: 0 // Could be calculated from settled payments if needed
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load dashboard'
      });
    } finally {
      // Done
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await groupService.createGroup(newGroup);
      setAlert({ type: 'success', message: 'Group created successfully' });
      setShowCreateGroup(false);
      setNewGroup({ name: '', description: '', members: [] });
      fetchDashboard();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create group'
      });
    }
  };

  const chartData = [
    { name: 'Total Owed to You', value: stats.totalOwedToYou },
    { name: 'You Owe', value: stats.totalYouOwe },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your expenses today.</p>
          </div>
          <Button 
            onClick={() => setShowCreateGroup(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <FiPlus /> New Group
          </Button>
        </div>

        {alert && (
          <div className="mb-6">
            <Alert 
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FiTrendingUp className="text-2xl" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">Total</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalExpenses.toFixed(2)}Rs</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full filter blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <FiTrendingUp className="text-2xl" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-600 rounded-full">Credit</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-500 text-sm font-medium mb-1">You are Owed</p>
              <h3 className="text-3xl font-bold text-green-600">{stats.totalOwedToYou.toFixed(2)}Rs</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full filter blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <FiTrendingUp className="text-2xl" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full">Debt</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-500 text-sm font-medium mb-1">You Owe</p>
              <h3 className="text-3xl font-bold text-red-600">{stats.totalYouOwe.toFixed(2)}Rs</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FiUsers className="text-2xl" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full">Active</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-500 text-sm font-medium mb-1">Total Groups</p>
              <h3 className="text-3xl font-bold text-gray-900">{groups.length}</h3>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Groups</h2>
                <a href="/groups" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</a>
              </div>
              
              {groups.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                  <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3">📁</div>
                  <p className="text-gray-600 font-medium">No groups yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Create one to get started!</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {groups.slice(0, 4).map(group => (
                    <a 
                      key={group._id}
                      href={`/group/${group._id}`}
                      className="group flex flex-col p-5 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold">
                          {group.name?.charAt(0)?.toUpperCase() || 'G'}
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {group.members?.length || 0} Members
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{group.name}</h3>
                      <p className="text-gray-500 text-xs line-clamp-1 mb-4 flex-1">{group.description || 'No description'}</p>
                      <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-medium">Total Spent</span>
                        <span className="text-sm font-bold text-gray-900">{(group.totalAmount || 0).toFixed(2)}Rs</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Expense Overview</h2>
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                {(stats.totalOwedToYou > 0 || stats.totalYouOwe > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📊</div>
                    <p className="text-gray-500 font-medium">No expense data yet</p>
                    <p className="text-gray-400 text-sm mt-1">Start adding expenses to see charts</p>
                  </div>
                )}
                
                {(stats.totalOwedToYou > 0 || stats.totalYouOwe > 0) && (
                  <div className="w-full mt-6 space-y-3">
                    {chartData.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                          <span className="text-sm text-gray-600 font-medium">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{entry.value.toFixed(2)}Rs</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateGroup}
        title="Create New Group"
        onClose={() => setShowCreateGroup(false)}
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Group Name</label>
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Roommates"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Optional group description"
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Create Group</Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCreateGroup(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;

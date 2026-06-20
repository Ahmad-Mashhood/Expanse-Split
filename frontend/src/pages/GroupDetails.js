import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { groupService, expenseService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';

const GroupDetails = () => {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Other',
    splitType: 'equal',
    splits: []
  });

  const fetchGroupDetails = useCallback(async () => {
    try {
      setLoading(true);
      const groupResponse = await groupService.getGroupById(groupId);
      setGroup(groupResponse.data.group);
      
      const expensesResponse = await expenseService.getExpenses(groupId);
      setExpenses(expensesResponse.data.expenses || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load group details'
      });
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      let formattedSplits = [];
      if (newExpense.splitType === 'custom') {
        formattedSplits = newExpense.splits.map(s => ({ user: s.user, amount: parseFloat(s.value || 0) }));
      } else if (newExpense.splitType === 'percentage') {
        const totalPercentage = newExpense.splits.reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
        if (totalPercentage !== 100) {
          setAlert({ type: 'error', message: 'Total percentage must be 100%' });
          return;
        }
        formattedSplits = newExpense.splits.map(s => ({ user: s.user, percentage: parseFloat(s.value || 0) }));
      }

      await expenseService.addExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        group: groupId,
        splits: formattedSplits
      });
      setAlert({ type: 'success', message: 'Expense added successfully' });
      setShowAddExpense(false);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Other',
        splitType: 'equal',
        splits: []
      });
      fetchGroupDetails();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add expense'
      });
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(expenseId);
        setAlert({ type: 'success', message: 'Expense deleted successfully' });
        fetchGroupDetails();
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Failed to delete expense'
        });
      }
    }
  };

  const handleApproveRequest = async (userIdToApprove) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/groups/${groupId}/approve-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userIdToApprove })
      });
      if (!response.ok) throw new Error('Failed to approve request');
      
      setAlert({ type: 'success', message: 'Member approved' });
      fetchGroupDetails();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleRejectRequest = async (userIdToReject) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/groups/${groupId}/reject-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userIdToReject })
      });
      if (!response.ok) throw new Error('Failed to reject request');
      
      setAlert({ type: 'success', message: 'Request rejected' });
      fetchGroupDetails();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // Safely decode token to get user ID even if React context was lost on refresh
  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return user?.id || user?._id;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || user?.id || user?._id;
    } catch (e) {
      return user?.id || user?._id;
    }
  };

  const currentUserId = getUserId();
  const isAdmin = group?.createdBy?._id === currentUserId;

  return (
    <div className="min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {alert && (
          <div className="mb-6">
            <Alert 
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {group && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-gray-900">{group.name}</h1>
                  {group.inviteCode && (
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-mono px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2 cursor-pointer hover:bg-indigo-100 transition-colors" title="Click to copy" onClick={() => navigator.clipboard.writeText(group.inviteCode)}>
                      CODE: {group.inviteCode}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{group.description}</p>
              </div>
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <FiPlus /> Add Expense
              </Button>
            </div>

            {isAdmin && group.joinRequests && group.joinRequests.length > 0 && (
              <div className="mb-8">
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Pending Join Requests
                  </h3>
                  <div className="space-y-3">
                    {group.joinRequests.map(reqUser => (
                      <div key={reqUser._id} className="flex items-center justify-between p-3 border border-orange-100 bg-orange-50/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {reqUser.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{reqUser.name}</p>
                            <p className="text-xs text-gray-500">{reqUser.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveRequest(reqUser._id)} className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleRejectRequest(reqUser._id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Group Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">{(group.totalAmount || 0).toFixed(2)}Rs</p>
              </Card>
              <Card>
                <p className="text-gray-600 text-sm">Members</p>
                <p className="text-3xl font-bold text-green-600">{group.members?.length || 0}</p>
              </Card>
            </div>

            {/* Expenses Table */}
            <Card>
              <h2 className="text-2xl font-bold mb-6">Expenses</h2>
              {expenses.length === 0 ? (
                <p className="text-gray-600">No expenses yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Description</th>
                        <th className="text-left py-2 px-2">Amount</th>
                        <th className="text-left py-2 px-2">Category</th>
                        <th className="text-left py-2 px-2">Paid By</th>
                        <th className="text-left py-2 px-2">Date</th>
                        <th className="text-left py-2 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map(expense => (
                        <tr key={expense._id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2">{expense.description}</td>
                          <td className="py-2 px-2">{expense.amount}Rs</td>
                          <td className="py-2 px-2">{expense.category}</td>
                          <td className="py-2 px-2">{expense.paidBy?.name}</td>
                          <td className="py-2 px-2">{new Date(expense.createdAt).toLocaleDateString()}</td>
                          <td className="py-2 px-2 space-x-2">
                            <button 
                              onClick={() => handleDeleteExpense(expense._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddExpense}
        title="Add New Expense"
        onClose={() => setShowAddExpense(false)}
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Dinner"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Split Type</label>
            <select
              value={newExpense.splitType}
              onChange={(e) => {
                const type = e.target.value;
                setNewExpense({ 
                  ...newExpense, 
                  splitType: type,
                  splits: group.members.map(m => ({ user: m._id, name: m.name, value: '' }))
                });
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="equal">Equal Split</option>
              <option value="custom">Custom Split</option>
              <option value="percentage">Percentage Split</option>
            </select>
          </div>

          {newExpense.splitType !== 'equal' && (
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <p className="text-sm font-bold text-gray-700 mb-2">
                {newExpense.splitType === 'custom' ? 'Specify Amounts (Rs)' : 'Specify Percentages (%)'}
              </p>
              {newExpense.splits.map((split, index) => (
                <div key={split.user} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600 truncate flex-1">{split.name}</span>
                  <div className="relative w-32">
                    <input
                      type="number"
                      value={split.value}
                      onChange={(e) => {
                        const newSplits = [...newExpense.splits];
                        newSplits[index].value = e.target.value;
                        setNewExpense({ ...newExpense, splits: newSplits });
                      }}
                      className={`w-full py-1.5 text-sm border rounded-lg focus:outline-none focus:border-blue-500 ${
                        newExpense.splitType === 'custom' ? 'pl-3 pr-8' : 'pl-7 pr-3'
                      }`}
                      placeholder="0"
                    />
                    <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-xs ${
                      newExpense.splitType === 'custom' ? 'right-3' : 'left-3'
                    }`}>
                      {newExpense.splitType === 'custom' ? 'Rs' : '%'}
                    </span>
                  </div>
                </div>
              ))}
              {newExpense.splitType === 'percentage' && (
                <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-bold">
                  <span>Total:</span>
                  <span className={
                    newExpense.splits.reduce((acc, curr) => acc + Number(curr.value || 0), 0) === 100 
                    ? 'text-green-600' 
                    : 'text-red-600'
                  }>
                    {newExpense.splits.reduce((acc, curr) => acc + Number(curr.value || 0), 0)}% / 100%
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Add Expense</Button>
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddExpense(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupDetails;

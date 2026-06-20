import React, { useState, useEffect } from 'react';
import { groupService, expenseService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiDownload } from 'react-icons/fi';
import { useCallback } from 'react';

const Reports = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await groupService.getGroups();
      const loadedGroups = response.data.groups || [];
      setGroups(loadedGroups);
      if (loadedGroups.length > 0) {
        handleGroupChange(loadedGroups[0]._id, loadedGroups);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load groups'
      });
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupChange = async (groupId, groupsList = groups) => {
    const group = groupsList.find(g => g._id === groupId);
    setSelectedGroup(group);
    
    try {
      const response = await expenseService.getExpenses(groupId);
      setGroupExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Failed to fetch expenses for report", error);
      setGroupExpenses([]);
    }
  };

  const generateChartData = useCallback(() => {
    if (!groupExpenses || groupExpenses.length === 0) return [];
    
    const categoryData = {};
    groupExpenses.forEach(expense => {
      if (expense.category) {
        categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
      }
    });

    return Object.entries(categoryData).map(([category, amount]) => ({
      name: category,
      amount: amount
    }));
  }, [groupExpenses]);

  useEffect(() => {
    setChartData(generateChartData());
  }, [generateChartData]);

  const handleExport = () => {
    if (!selectedGroup || !groupExpenses.length) {
      setAlert({ type: 'error', message: 'No data to export' });
      return;
    }

    const headers = ['Description', 'Amount', 'Category', 'Paid By', 'Date'];
    const rows = groupExpenses.map(exp => [
      exp.description,
      exp.amount,
      exp.category,
      exp.paidBy?.name || 'Unknown',
      new Date(exp.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedGroup.name}_Expense_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
          <Button 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <FiDownload /> Export Report
          </Button>
        </div>

        {alert && (
          <Alert 
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <label className="block text-gray-700 font-semibold mb-2">Select Group</label>
            <select
              value={selectedGroup?._id || ''}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              {groups.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </Card>

          {selectedGroup && (
            <>
              <Card>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-3xl font-bold text-blue-600">{(selectedGroup.totalAmount || 0).toFixed(2)}Rs</p>
              </Card>

              <Card>
                <p className="text-gray-600 text-sm">Total Members</p>
                <p className="text-3xl font-bold text-green-600">{selectedGroup.members?.length || 0}</p>
              </Card>
            </>
          )}
        </div>

        {/* Charts */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Expenses by Category</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#3B82F6" name="Amount (Rs)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">No expense data available</p>
          )}
        </Card>

        {/* Detailed Breakdown */}
        {selectedGroup && groupExpenses && groupExpenses.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold mb-6">Detailed Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Category</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map(item => (
                    <tr key={item.name} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">{item.name}</td>
                      <td className="py-2 px-2">{item.amount.toFixed(2)}Rs</td>
                      <td className="py-2 px-2">
                        {selectedGroup.totalAmount ? ((item.amount / selectedGroup.totalAmount) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;

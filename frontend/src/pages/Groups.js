import React, { useState, useEffect, useCallback } from 'react';
import { groupService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { FiPlus, FiUsers, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', members: [] });

  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [showJoinGroup, setShowJoinGroup] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const groupsResponse = await groupService.getGroups();
      setGroups(groupsResponse.data.groups || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load groups'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      // Split members input by comma and trim whitespace
      const membersArray = newGroup.members
        ? (typeof newGroup.members === 'string' 
            ? newGroup.members.split(',').map(m => m.trim()).filter(m => m) 
            : newGroup.members)
        : [];

      await groupService.createGroup({ ...newGroup, members: membersArray });
      setAlert({ type: 'success', message: 'Group created successfully' });
      setShowCreateGroup(false);
      setNewGroup({ name: '', description: '', members: '' });
      fetchGroups();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create group'
      });
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      // Use standard fetch or an exported join API if we had one.
      // Assuming groupService.joinViaInvite doesn't exist yet in api.js, we will just use axios directly or add it.
      // To keep it simple, we use the auth token and fetch
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/groups/join/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: inviteCodeInput })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to send request');
      
      setAlert({ type: 'success', message: data.message });
      setShowJoinGroup(false);
      setInviteCodeInput('');
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to join group'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Groups</h1>
            <p className="text-gray-500 mt-2">Manage your expense sharing groups</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="secondary"
              onClick={() => setShowJoinGroup(true)}
              className="flex items-center justify-center gap-2 flex-1 md:flex-none border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Join Group
            </Button>
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center justify-center gap-2 flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <FiPlus /> Create Group
            </Button>
          </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length === 0 && !loading ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4">
                <FiUsers />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">You haven't joined or created any groups yet. Create your first group or join an existing one.</p>
              <div className="flex gap-3">
                <Button onClick={() => setShowCreateGroup(true)}>Create Group</Button>
                <Button variant="secondary" onClick={() => setShowJoinGroup(true)}>Join Group</Button>
              </div>
            </div>
          ) : (
            groups.map(group => (
              <div 
                key={group._id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 text-xl font-bold">
                    {group.name?.charAt(0)?.toUpperCase() || 'G'}
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {group.members?.length || 0} Members
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{group.description || 'No description provided.'}</p>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Expenses</p>
                    <p className="font-bold text-gray-900">{(group.totalAmount || 0).toFixed(2)}Rs</p>
                  </div>
                  
                  <Link to={`/group/${group._id}`} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={showCreateGroup}
        title="Create New Group"
        onClose={() => setShowCreateGroup(false)}
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. Goa Trip 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Invite Members (Emails)</label>
            <input
              type="text"
              value={newGroup.members || ''}
              onChange={(e) => setNewGroup({ ...newGroup, members: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="user1@ex.com, user2@ex.com..."
            />
            <p className="text-xs text-gray-500 mt-1">Separate emails with commas. Users must be registered.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Optional group description..."
              rows="3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => setShowCreateGroup(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 text-white">Create Group</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showJoinGroup}
        title="Join Group"
        onClose={() => setShowJoinGroup(false)}
      >
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Invite Code</label>
            <input
              type="text"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono tracking-widest text-center text-lg"
              placeholder="ENTER CODE"
            />
            <p className="text-sm text-gray-500 mt-3 text-center">
              Ask the group admin to share the invite code with you. Upon joining, the admin will need to approve your request.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => setShowJoinGroup(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 text-white">Request to Join</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;

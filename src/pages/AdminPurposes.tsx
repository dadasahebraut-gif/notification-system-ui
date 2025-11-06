import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config/api';
import { TagIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

interface Purpose {
  id: string;
  name: string;
  description: string;
  created_at: string;
  is_active: boolean;
}

const AdminPurposes: React.FC = () => {
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPurposes();
  }, []);

  const fetchPurposes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/purposes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurposes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch purposes');
    } finally {
      setLoading(false);
    }
  };

  const filteredPurposes = purposes.filter(purpose =>
    purpose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purpose.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TagIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Purposes Management</h1>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all">
            <PlusIcon className="w-5 h-5" />
            <span>Add Purpose</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search purposes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPurposes.map((purpose) => (
                  <tr key={purpose.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{purpose.name}</td>
                    <td className="px-6 py-4 text-gray-300 max-w-md">{purpose.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        purpose.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {purpose.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(purpose.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <PencilIcon className="w-5 h-5 text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <TrashIcon className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPurposes;

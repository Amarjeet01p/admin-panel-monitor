import React, { useEffect, useState } from 'react';

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/users') // Replace with your actual endpoint
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const getBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'passport':
        return 'bg-green-100 text-green-800';
      case 'driver license':
        return 'bg-blue-100 text-blue-800';
      case 'national id':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">All Registered Users</h2>

      <input
        type="text"
        placeholder="Search by any field"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border mb-6 rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">ID Type</th>
              <th className="px-4 py-2 border">ID Number</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.phone || 'N/A'}</td>
                  <td className="px-4 py-2 border">{user.address || 'N/A'}</td>
                  <td className="px-4 py-2 border text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${getBadgeClass(user.id_type)}`}>
                      {user.id_type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{user.id_number || 'N/A'}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
            <p><strong>ID Type:</strong> {selectedUser.id_type || 'N/A'}</p>
            <p><strong>ID Number:</strong> {selectedUser.id_number || 'N/A'}</p>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

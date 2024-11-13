import React from 'react';
import { Lecturer, Room, calculateRemainingDays } from '../types';
import { Edit2, LogOut } from 'lucide-react';

interface Props {
  lecturers: Lecturer[];
  onCheckOut: (id: string) => void;
  onEditRoom: (id: string, newRoom: string) => void;
  rooms: Room[];
}

export function LecturerTable({ lecturers, onCheckOut, onEditRoom, rooms }: Props) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newRoom, setNewRoom] = React.useState('');
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    const timer = setInterval(() => forceUpdate(), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEditSubmit = (id: string) => {
    onEditRoom(id, newRoom);
    setEditingId(null);
    setNewRoom('');
  };

  const availableRooms = rooms.filter(room => !room.isOccupied);

  if (lecturers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No lecturers currently checked in
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lecturer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Room
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remaining
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check-In Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lecturers.map((lecturer) => {
            const remainingDays = calculateRemainingDays(lecturer.checkInDate, lecturer.numberOfDays);
            return (
              <tr key={lecturer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lecturer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lecturer.className}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === lecturer.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={newRoom}
                        onChange={(e) => setNewRoom(e.target.value)}
                      >
                        <option value="">Select</option>
                        {availableRooms.map(room => (
                          <option key={room.number} value={room.number}>
                            {room.number}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEditSubmit(lecturer.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">{lecturer.roomNumber}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lecturer.numberOfDays}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    remainingDays <= 1 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {remainingDays} days
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(lecturer.checkInDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setEditingId(lecturer.id);
                        setNewRoom(lecturer.roomNumber);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCheckOut(lecturer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
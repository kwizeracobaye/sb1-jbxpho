import React from 'react';
import { Header } from './components/Header';
import { CheckInForm } from './components/CheckInForm';
import { CheckOutForm } from './components/CheckOutForm';
import { LecturerTable } from './components/LecturerTable';
import { RoomManagement } from './components/RoomManagement';
import { Toast } from './components/Toast';
import { Lecturer, LecturerFormData, Room } from './types';

function App() {
  const [lecturers, setLecturers] = React.useState<Lecturer[]>(() => {
    const saved = localStorage.getItem('lecturers');
    return saved ? JSON.parse(saved) : [];
  });

  const [rooms, setRooms] = React.useState<Room[]>(() => {
    const saved = localStorage.getItem('rooms');
    return saved ? JSON.parse(saved) : [
      { number: 'A101', isOccupied: false },
      { number: 'A102', isOccupied: false },
      { number: 'B201', isOccupied: false },
      { number: 'B202', isOccupied: false },
    ];
  });

  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  React.useEffect(() => {
    localStorage.setItem('lecturers', JSON.stringify(lecturers));
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [lecturers, rooms]);

  const handleAddRoom = (roomNumber: string) => {
    if (rooms.some(room => room.number === roomNumber)) {
      setToast({
        message: 'Room already exists',
        type: 'error',
      });
      return;
    }

    setRooms([...rooms, { number: roomNumber, isOccupied: false }]);
    setToast({
      message: 'Room added successfully',
      type: 'success',
    });
  };

  const handleEditRoom = (oldNumber: string, newNumber: string) => {
    if (oldNumber === newNumber) return;

    if (rooms.some(room => room.number === newNumber)) {
      setToast({
        message: 'Room number already exists',
        type: 'error',
      });
      return;
    }

    const room = rooms.find(r => r.number === oldNumber);
    if (room?.isOccupied) {
      setToast({
        message: 'Cannot edit occupied room',
        type: 'error',
      });
      return;
    }

    setRooms(rooms.map(room => 
      room.number === oldNumber ? { ...room, number: newNumber } : room
    ));
    setToast({
      message: 'Room updated successfully',
      type: 'success',
    });
  };

  const handleDeleteRoom = (roomNumber: string) => {
    const room = rooms.find(r => r.number === roomNumber);
    if (room?.isOccupied) {
      setToast({
        message: 'Cannot delete occupied room',
        type: 'error',
      });
      return;
    }

    setRooms(rooms.filter(room => room.number !== roomNumber));
    setToast({
      message: 'Room deleted successfully',
      type: 'success',
    });
  };

  const handleCheckIn = (data: LecturerFormData) => {
    const existingLecturer = lecturers.find(
      (l) => l.name.toLowerCase() === data.name.toLowerCase()
    );

    if (existingLecturer) {
      setToast({
        message: 'Lecturer is already checked in',
        type: 'error',
      });
      return;
    }

    const room = rooms.find(r => r.number === data.roomNumber);
    if (!room) {
      setToast({
        message: 'Invalid room number',
        type: 'error',
      });
      return;
    }

    if (room.isOccupied) {
      setToast({
        message: 'Room is already occupied',
        type: 'error',
      });
      return;
    }

    const newLecturer: Lecturer = {
      ...data,
      id: crypto.randomUUID(),
      checkInDate: new Date().toISOString(),
    };

    setLecturers([...lecturers, newLecturer]);
    setRooms(rooms.map(r => 
      r.number === data.roomNumber ? { ...r, isOccupied: true } : r
    ));
    setToast({
      message: 'Lecturer successfully checked in',
      type: 'success',
    });
  };

  const handleCheckOut = (name: string) => {
    const lecturer = lecturers.find(
      (l) => l.name.toLowerCase() === name.toLowerCase()
    );

    if (!lecturer) {
      setToast({
        message: 'Lecturer not found',
        type: 'error',
      });
      return;
    }

    setLecturers(lecturers.filter((l) => l.id !== lecturer.id));
    setRooms(rooms.map(r => 
      r.number === lecturer.roomNumber ? { ...r, isOccupied: false } : r
    ));
    setToast({
      message: 'Lecturer successfully checked out',
      type: 'success',
    });
  };

  const handleCheckOutById = (id: string) => {
    const lecturer = lecturers.find(l => l.id === id);
    if (lecturer) {
      setLecturers(lecturers.filter((l) => l.id !== id));
      setRooms(rooms.map(r => 
        r.number === lecturer.roomNumber ? { ...r, isOccupied: false } : r
      ));
      setToast({
        message: 'Lecturer successfully checked out',
        type: 'success',
      });
    }
  };

  const handleEditLecturerRoom = (id: string, newRoom: string) => {
    const lecturer = lecturers.find(l => l.id === id);
    const targetRoom = rooms.find(r => r.number === newRoom);

    if (!targetRoom) {
      setToast({
        message: 'Invalid room number',
        type: 'error',
      });
      return;
    }

    if (targetRoom.isOccupied) {
      setToast({
        message: 'Room is already occupied',
        type: 'error',
      });
      return;
    }

    if (lecturer) {
      setLecturers(
        lecturers.map((l) =>
          l.id === id ? { ...l, roomNumber: newRoom } : l
        )
      );
      setRooms(rooms.map(r => {
        if (r.number === lecturer.roomNumber) return { ...r, isOccupied: false };
        if (r.number === newRoom) return { ...r, isOccupied: true };
        return r;
      }));
      setToast({
        message: 'Room number updated successfully',
        type: 'success',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <RoomManagement 
            rooms={rooms} 
            onAddRoom={handleAddRoom}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Check In</h2>
                <CheckInForm onSubmit={handleCheckIn} rooms={rooms} />
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Check Out</h2>
                <CheckOutForm onSubmit={handleCheckOut} />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current Check-Ins</h2>
              <LecturerTable
                lecturers={lecturers}
                onCheckOut={handleCheckOutById}
                onEditRoom={handleEditLecturerRoom}
                rooms={rooms}
              />
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
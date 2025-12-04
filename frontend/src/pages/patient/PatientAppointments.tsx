import React, { useState } from 'react';

const PatientAppointments: React.FC = () => {
  const [showBookModal, setShowBookModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <button 
          onClick={() => setShowBookModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Book New Appointment
        </button>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Doctor</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reason</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">Dr. Sarah Smith</td>
              <td className="px-6 py-4">Oct 24, 2025 - 10:00 AM</td>
              <td className="px-6 py-4">Routine Checkup</td>
              <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">SCHEDULED</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Booking Modal (Mock) */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ailment / Reason</label>
                <select className="w-full border rounded-lg p-2">
                  <option>General Checkup</option>
                  <option>Fever / Flu</option>
                  <option>Diabetes Follow-up</option>
                </select>
              </div>
              <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                Auto-assigned to: <strong>Dr. Sarah Smith</strong> (General Medicine)
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Slot</label>
                <input type="datetime-local" className="w-full border rounded-lg p-2" />
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
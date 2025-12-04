import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientProfile from './pages/patient/PatientProfile'; // Imported here

// Doctor Pages
import DoctorAppointments from './pages/doctor/DoctorAppointments'; 

// Placeholder for missing components to make code compile
const Placeholder = ({ title }: { title: string }) => (
  <div className="text-2xl font-bold text-gray-400">{title} Page</div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          
          {/* Patient Routes */}
          <Route path="/patient/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="goals" element={<Placeholder title="Set Goals" />} />
                
                {/* Updated this line to use the real component */}
                <Route path="profile" element={<PatientProfile />} />
                
                <Route path="info" element={<Placeholder title="Health Info" />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardLayout>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/*" element={
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<Placeholder title="Doctor Dashboard" />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="profile" element={<Placeholder title="Doctor Profile" />} />
                <Route path="info" element={<Placeholder title="Health Info" />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
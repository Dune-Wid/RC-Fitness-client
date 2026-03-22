import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Staff from './pages/Staff';
import MemberProfile from './pages/MemberProfile';
import Finances from './modules/finance/Finances';
import Shop from './pages/Shop';
import EventCalendar from './pages/Event';
import PublicShop from './pages/PublicShop';
import PublicEvent from './pages/PublicEvent';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  return role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<MemberProfile />} />

        {/* Protected Admin Routes */}
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/members" element={<AdminRoute><Members /></AdminRoute>} />
        <Route path="/staff" element={<AdminRoute><Staff /></AdminRoute>} />
        <Route path="/finances" element={<AdminRoute><Finances /></AdminRoute>} />
        <Route path="/shop" element={<AdminRoute><Shop /></AdminRoute>} />
        <Route path="/event" element={<AdminRoute><EventCalendar /></AdminRoute>} />
        
        {/* Public Views */}
        <Route path="/store" element={<PublicShop />} />
        <Route path="/events" element={<PublicEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
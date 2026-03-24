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
<<<<<<< Updated upstream
=======
import WorkoutPlans from './pages/WorkoutPlans';
import DietPlans from './pages/DietPlans';
import Progress from './pages/Progress';
import Equipment from './pages/Equipment';
import Classes from './pages/Classes';
import MemberReviews from './pages/MemberReviews';
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSidebar';
>>>>>>> Stashed changes

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  return role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
  return (
<<<<<<< Updated upstream
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
=======
    <CartProvider>
      <Router>
        <CartSidebar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<MemberProfile />} />
          <Route path="/workout-plans" element={<WorkoutPlans />} />
          <Route path="/diet-plans" element={<DietPlans />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/reviews" element={<MemberReviews />} />

          {/* Protected Admin Routes */}
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/members" element={<AdminRoute><Members /></AdminRoute>} />
          <Route path="/staff" element={<AdminRoute><Staff /></AdminRoute>} />
          <Route path="/finances" element={<AdminRoute><Finances /></AdminRoute>} />
          <Route path="/shop" element={<AdminRoute><Shop /></AdminRoute>} />
          <Route path="/event" element={<AdminRoute><EventCalendar /></AdminRoute>} />
          <Route path="/equipment" element={<AdminRoute><Equipment /></AdminRoute>} />
          
          {/* Public Views */}
          <Route path="/store" element={<PublicShop />} />
          <Route path="/store/product/:id" element={<PublicProduct />} />
          <Route path="/events" element={<PublicEvent />} />
        </Routes>
      </Router>
    </CartProvider>
>>>>>>> Stashed changes
  );
}

export default App;
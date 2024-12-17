import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar.jsx';
import Home from './Home.jsx';
import Login from './components/Login.jsx';
import PokemonSelector from './components/PokemonSelector.jsx';
import BattleSimulator from './components/BattleSimulator.jsx';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state
      setLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading screen until auth state resolves
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={<ProtectedRoute user={user} />}
        >
          <Route path="/select-pokemon" element={<PokemonSelector />} />
          <Route path="/battle-simulator" element={<BattleSimulator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

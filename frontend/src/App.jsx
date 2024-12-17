import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar.jsx';
import Home from './Home.jsx';
import Login from './components/Login.jsx';
import PokemonSelector from './components/PokemonSelector.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/select-pokemon" element={<PokemonSelector />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

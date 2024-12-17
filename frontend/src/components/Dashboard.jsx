import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('No user is logged in');
          navigate('/login'); // Redirect to login if no user is logged in
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setStats(userDoc.data());
        } else {
          console.log('User stats not found');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>
      <div className="stats-container">
        <div className="stats-card">
          <h2>Wins</h2>
          <p>{stats.wins}</p>
        </div>
        <div className="stats-card">
          <h2>Losses</h2>
          <p>{stats.losses}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

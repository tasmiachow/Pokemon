import { Link } from 'react-router-dom';
import './styles/Home.css';
// import Footer from './Footer'
const Home = () => {
  return (
    <>
    <div className="home">
      <div className="text-container">
        <h1>Pokemon Battle Simulator</h1>
        <p>
          Make an account and start playing!
        </p>
        <Link to="/login">
          <button className="start-button">Get Started</button>
        </Link>
      </div>
      <div className="gif-container">
        <img src="/homegif.gif" alt="pikachu and eevee" className="learning-gif" />
      </div>
    </div>
    {/* <Footer/> */}
    </>
  );
}

export default Home;

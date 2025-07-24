  import { Routes, Route } from 'react-router-dom';
  import Home from './pages/Home';
  import About from './pages/About';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import Header from './components/Header';
  

  function App() {
    return (
      <>
        <Header />
        <Routes>
          

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </>
    );
  }

  export default App;

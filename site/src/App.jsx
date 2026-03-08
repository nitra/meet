import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Custom from './pages/Custom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms/:roomName" element={<Room />} />
      <Route path="/custom" element={<Custom />} />
    </Routes>
  );
}

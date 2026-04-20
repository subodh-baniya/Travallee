import { ThemeProvider } from './contexts/ThemeContext';
import HotelAdminLayout from './components/layout/HotelAdminLayout';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <HotelAdminLayout />
    </ThemeProvider>
  );
}

export default App;

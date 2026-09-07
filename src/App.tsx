import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './feature/context/AuthContext';
import { FavoritesProvider } from './feature/context/FavoritesContext';
import { ErrorBoundary } from './feature/components/common/ErrorBoundary';
import { Navbar } from './feature/components/layout/Navbar';
import { AppRoutes } from './feature/routes/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-slate-50">
              <Navbar />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </div>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

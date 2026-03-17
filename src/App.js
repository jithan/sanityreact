import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import PageDetail from './pages/PageDetail';
import Header from './header/Header';
import Footer from './footer/Footer';
import { LiveQueryProvider } from '@sanity/preview-kit';
import LandingPageDetail from "./pages/LandingPageDetail";
import { client } from './sanityClient'
import './App.css';

function App() {

  return (
    <LiveQueryProvider client={client}>
      <Router>
        <div className="app">
          <Header />

          <main className="main-content">
            <Routes>
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/:slug" element={<MovieDetail />} />
              <Route path="/pages/:slug" element={<PageDetail />} />
              <Route path="/landing/:slug" element={<LandingPageDetail />} />
              <Route path="/" element={<PageDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </LiveQueryProvider>

  );
}

export default App;
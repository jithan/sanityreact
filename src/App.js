import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import PageDetail from './components/PageDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import { client } from './sanityClient';
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "page" && showInHeaderMenu == true] | order(menuOrder asc, title asc) {
            _id,
            title,
            slug,
            menuTitle
          }
        `);
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return (
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
            <Route path="/" element={<PageDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
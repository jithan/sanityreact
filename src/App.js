import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import PageDetail from './components/PageDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import { LiveQueryProvider } from '@sanity/preview-kit'
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
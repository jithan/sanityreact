import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';
import '../styles/Header.css';

function Header() {
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
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          RLTHub
        </Link>
        <ul className="nav-menu">
           {!loading &&
            (menuItems || []).map((item) => (
              <li key={item._id}>
                <Link to={`/pages/${item.slug.current}`}>{item.menuTitle || item.title}</Link>
              </li>
            ))}
          <li>
            <Link to="/articles">Articles</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';
import './Header.css';

function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [megaMenu, setMegaMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [menuItemsData, megaMenuData] = await Promise.all([
          client.fetch(`
            *[_type == "page" && showInHeaderMenu == true] | order(menuOrder asc, title asc) {
              _id,
              title,
              slug,
              menuTitle
            }
          `),
          client.fetch(`
            *[_type == "megaMenu"][0] {
              title,
              columns[] {
                title,
                links[] {
                  icon,
                  title,
                  description,
                  "href": coalesce(link->slug.current, ""),
                  "linkType": link->_type
                }
              }
            }
          `),
        ]);

        setMenuItems(menuItemsData);
        setMegaMenu(megaMenuData);
      } catch (err) {
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const [mobilePane, setMobilePane] = useState('main');

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobilePane('main');
    setIsMegaMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) setMobilePane('main');
      return next;
    });
  };

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };

  const megaMenuSections = [
    {
      heading: 'Genres',
      links: [
        { label: 'Action', to: '/movies/genre/action' },
        { label: 'Comedy', to: '/movies/genre/comedy' },
        { label: 'Drama', to: '/movies/genre/drama' },
        { label: 'Horror', to: '/movies/genre/horror' },
      ],
    },
    {
      heading: 'Years',
      links: [
        { label: '2023', to: '/movies/year/2023' },
        { label: '2022', to: '/movies/year/2022' },
        { label: '2021', to: '/movies/year/2021' },
        { label: '2020', to: '/movies/year/2020' },
      ],
    },
    {
      heading: 'Popular',
      links: [
        { label: 'Top Rated', to: '/movies/popular/top-rated' },
        { label: 'New Releases', to: '/movies/popular/new-releases' },
        { label: 'Classics', to: '/movies/popular/classics' },
      ],
    },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Lorum Ipsum
        </Link>

        <div className={`nav-menu-container ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="desktop-nav">
            <ul className="nav-menu">
              {!loading &&
                (menuItems || []).map((item) => (
                  <li key={item._id}>
                    <Link to={`/pages/${item.slug.current}`}>{item.menuTitle || item.title}</Link>
                  </li>
                ))}
              <li
                className="mega-menu-item"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  className="mega-menu-trigger"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMegaMenu();
                  }}
                  aria-expanded={isMegaMenuOpen}
                >
                  {megaMenu?.title || 'Menu'}
                </button>
                {isMegaMenuOpen && megaMenu?.columns && (
                  <div className="mega-menu">
                    <div className="mega-menu-inner">
                      <div className="mega-menu-intro">
                        <h3>{megaMenu?.title || 'Menu'}</h3>
                        <p>Select a section below to browse.</p>
                      </div>
                      {megaMenu.columns.map((column) => (
                        <div key={column.title} className="mega-menu-section">
                          <h4>{column.title}</h4>
                          <ul>
                            {(column.links || []).map((link) => (
                              <li key={`${column.title}-${link.href || link.title}`}>
                                <Link to={link.href || '#'}>{link.title}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link to="/articles">Articles</Link>
              </li>
            </ul>
          </div>

          <div className="mobile-nav">
            <div
              className="mobile-menu-slider"
              style={{ transform: mobilePane === 'main' ? 'translateX(0)' : 'translateX(-100%)' }}
            >
              <div className="mobile-menu-panel">
                <ul className="mobile-menu-list">
                  {!loading &&
                    (menuItems || []).map((item) => (
                      <li key={item._id}>
                        <Link to={`/pages/${item.slug.current}`} onClick={closeMobileMenu}>
                          {item.menuTitle || item.title}
                        </Link>
                      </li>
                    ))}
                  <li>
                    <button
                      className="mobile-submenu-button"
                      onClick={() => setMobilePane('mega')}
                    >
                      {megaMenu?.title || 'Menu'}
                    </button>
                  </li>
                  <li>
                    <Link to="/articles" onClick={closeMobileMenu}>
                      Articles
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mobile-menu-panel">
                <div className="mobile-submenu-header">
                  <button className="mobile-back" onClick={() => setMobilePane('main')}>
                    ← Back
                  </button>
                  <h3>{megaMenu?.title || 'Menu'}</h3>
                </div>
                <div className="mobile-submenu-sections">
                  {(megaMenu?.columns || []).map((section) => (
                    <div key={section.title} className="mobile-submenu-section">
                      <h4>{section.title}</h4>
                      <ul>
                        {(section.links || []).map((link) => (
                          <li key={`${section.title}-${link.href || link.title}`}>
                            <Link to={link.href || '#'} onClick={closeMobileMenu}>
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="hamburger" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Header;

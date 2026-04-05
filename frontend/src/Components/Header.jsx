import { useEffect } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(currentUser);
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchItem", searchItem);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const itemFromUrl = urlParams.get("searchItem") || "";
    setSearchItem(itemFromUrl);
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <nav className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Home</span>
            <span className="text-slate-700">Linker</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
            aria-label="search"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 text-xs sm:text-base">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <li>
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={currentUser.profileImage}
                  alt="Profile"
                />
              </li>
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </nav>
    </header>
  );
}

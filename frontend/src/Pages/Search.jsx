import { useNavigate, useLocation, data } from "react-router-dom";
import { useState, useEffect } from "react";
import ListingItem from "../Components/ListingItem";
export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  const [showMore, setShowMore] = useState(false);
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    } else if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    } else if (e.target.id === "offer") {
      setSidebardata({ ...sidebardata, offer: e.target.checked });
    } else if (e.target.id === "parking") {
      setSidebardata({ ...sidebardata, parking: e.target.checked });
    } else if (e.target.id === "furnished") {
      setSidebardata({ ...sidebardata, furnished: e.target.checked });
    } else if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm")
      ? urlParams.get("searchTerm")
      : "";
    const typeFromUrl = urlParams.get("type") ? urlParams.get("type") : "all";
    const parkingFromUrl = urlParams.get("parking") === "true" ? true : false;
    const furnishedFromUrl =
      urlParams.get("furnished") === "true" ? true : false;
    const offerFromUrl = urlParams.get("offer") === "true" ? true : false;
    const sortFromUrl = urlParams.get("sort")
      ? urlParams.get("sort")
      : "created_at";
    const orderFromUrl = urlParams.get("order")
      ? urlParams.get("order")
      : "desc";
    setSidebardata({
      searchTerm: searchTermFromUrl,
      type: typeFromUrl,
      parking: parkingFromUrl,
      furnished: furnishedFromUrl,
      offer: offerFromUrl,
      sort: sortFromUrl,
      order: orderFromUrl,
    });
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/listing/search?${searchQuery}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          setLoading(false);
        }
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }

        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching listings:", error.message);
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search]);
  const onShowMoreClick = async () => {
    const listingsLength = listings.length;
    const startIndex = listingsLength;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      const response = await fetch(`/api/listing/search?${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      if (data.length < 8) {
        setShowMore(false);
      }
      setListings((prevListings) => [...prevListings, ...data]);
    } catch (error) {
      console.log("Error fetching more listings:", error.message);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-slate-200 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search Term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebardata.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebardata.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebardata.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebardata.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Amenities Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebardata.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebardata.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          {/* Search Button */}
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Listing Results */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4 justify-center">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings.length > 0 &&
            listings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

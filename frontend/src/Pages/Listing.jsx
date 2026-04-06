import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import Contact from "../Components/Contact.jsx";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const fetchListing = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/listing/getListing/${listingId}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch listing");
        setListing(null);
      } else if (!data || !data._id) {
        setError("Listing data is invalid");
        setListing(null);
      } else {
        setListing(data);
      }
    } catch (err) {
      setError("Network error", err);
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    } else {
      setError("Listing ID is missing");
    }
  }, [listingId, fetchListing]);

  if (loading) return <p className="text-center text-3xl my-7">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl">{error}</p>;

  if (!listing) return null; // no listing, nothing to render

  return (
    <main>
      <Swiper navigation>
        {Array.isArray(listing.imageUrls) && listing.imageUrls.length > 0 ? (
          listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[400px] w-full"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))
        ) : (
          <div className="h-[400px] bg-gray-200 flex items-center justify-center">
            No Images Available
          </div>
        )}
      </Swiper>

      {/* Share button */}
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        />
      </div>
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}

      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p className="text-2xl font-semibold">
          {listing.name} - $
          {listing.offer
            ? listing.discountPrice?.toLocaleString("en-US")
            : listing.regularPrice?.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
        </p>

        <p className="flex items-center mt-3 gap-2 text-slate-600 text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address || "Address not available"}
        </p>

        <div className="flex gap-4">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {listing.offer && listing.discountPrice && listing.regularPrice && (
            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </p>
          )}
        </div>

        <p className="text-slate-800">
          <span className="font-semibold text-black">Description - </span>
          {listing.description || "No description available"}
        </p>

        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBed className="text-lg" />
            {listing.bedrooms
              ? `${listing.bedrooms} ${listing.bedrooms > 1 ? "beds" : "bed"}`
              : "N/A"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBath className="text-lg" />
            {listing.bathrooms
              ? `${listing.bathrooms} ${
                  listing.bathrooms > 1 ? "baths" : "bath"
                }`
              : "N/A"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaParking className="text-lg" />
            {listing.parking ? "Parking spot" : "No Parking"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaChair className="text-lg" />
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </li>
        </ul>

        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
          >
            Contact landlord
          </button>
        )}

        {contact && <Contact listing={listing} />}
      </div>
    </main>
  );
}

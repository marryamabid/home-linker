import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const [uploadPercent, setUploadPercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [showListing, setShowListing] = useState({});

  const fileInputRef = useRef(null);

  // ✅ Handle image upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError(true);
      setUploadPercent(0);
      return;
    }

    const formImage = new FormData();
    formImage.append("file", file);
    formImage.append("upload_preset", "profile_upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/df14gd1tp/image/upload",
        formImage,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercent(percentCompleted);
          },
        }
      );
      setFormData({ ...formData, profileImage: response.data.secure_url });
      setFileUploadError(false);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setFileUploadError(true);
    }
  };

  // ✅ Handle input field changes
  const handleUpdateChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include cookies for auth
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log("Updated user data:", data.user);
      dispatch(updateUserSuccess(data.user));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // ✅ Auto-clear success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timeout = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [updateSuccess]);

  const handleUserDelete = async () => {
    try {
      deleteUserStart();
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include", // include cookies for auth
      });
      const data = await res.json();
      if (data.success === false) {
        deleteUserFailure(data.message);
        return;
      }
      alert(data.message);
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      deleteUserFailure(error.message);
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      console.log(data.message);
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      console.error("Sign out failed:", error.message);
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        console.log(data.message);
        return;
      }
      console.log("User listings:", data.userListings);
      setShowListing(data.userListings);
      setShowListingError(false);
    } catch (error) {
      console.error("Error fetching listings:", error.message);
      setShowListingError(true);
    }
  };
  const deleteUserListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setShowListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-4">Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Profile image preview */}
        <img
          onClick={() => fileInputRef.current?.click()}
          src={formData.profileImage || currentUser?.profileImage}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* Upload progress or error */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error uploading image (must be less than 2MB)
            </span>
          ) : uploadPercent > 0 && uploadPercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadPercent}%...`}</span>
          ) : uploadPercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : null}
        </p>

        {/* Username */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          onChange={handleUpdateChange}
        />

        {/* Email */}
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          onChange={handleUpdateChange}
        />

        {/* Password (new only) */}
        <input
          type="password"
          id="password"
          placeholder="New Password"
          className="border p-3 rounded-lg"
          onChange={handleUpdateChange}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
          className="bg-blue-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      {/* Placeholder actions */}
      <div className="flex justify-between mt-5">
        <span
          onClick={handleUserDelete}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700">User updated successfully!</p>
      )}
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      {showListingError && (
        <p className="text-red-500 mt-2">{showListingError}</p>
      )}
      {showListing.length === 0 && (
        <div className="text-center">
          <p className="text-lg text-red-300  font-medium">No listings found</p>
          <p className="text-sm text-gray-400">
            Start by creating your first listing.
          </p>
        </div>
      )}
      {showListing && showListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold mb-2">
            Your Listings
          </h1>
          {showListing.map((listing) => (
            <div
              key={listing._id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button
                  onClick={() => deleteUserListing(listing._id)}
                  className="text-red-700"
                >
                  Delete
                </button>
                <Link to={`/edit-listing/${listing._id}`}>
                  <button className="text-green-700">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

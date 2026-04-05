import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
export default function EditListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent", // default type
    bathrooms: 1,
    bedrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const params = useParams();
  const listingId = params.listingId;
  const navigate = useNavigate();
  //store image
  const storeImage = async (file) => {
    const formImage = new FormData();
    formImage.append("file", file);
    formImage.append("upload_preset", "profile_upload");
    formImage.append("cloud_name", "df14gd1tp");
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/df14gd1tp/image/upload`,
        {
          method: "POST",
          body: formImage,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error.messsage);
    }
  };
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      try {
        setImageUploadError(false);
        setUploading(true);
        const uploadImages = Array.from(files).map((file) => storeImage(file));
        const imageUrls = await Promise.all(uploadImages);
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(imageUrls),
        }));
        setImageUploadError(false);
        setUploading(false);
        console.log("Uploaded images:", imageUrls);
      } catch (error) {
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
        console.error(error);
      }
    } else {
      setImageUploadError("You can upload a maximum of 6 images");
    }
  };
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    const key = id === "sale" || id === "rent" ? "type" : id; //checks id for which element we are making changes
    let newValue;
    if (id === "sale" || id === "rent") {
      newValue = id;
    } else if (["parking", "furnished", "offer"].includes(id)) {
      newValue = checked;
    } else {
      newValue = value;
    }
    setFormData((prev) => {
      return {
        ...prev,
        [key]: newValue,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/listing/update/${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...formData, userRef: currentUser._id }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      console.log("update listing successfully:");
      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError("Failed to update listing");
      console.error("Error creating listing:", error.message);
      setLoading(false);
    }
  };
  const fetchListing = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/listing/getListing/${listingId}`
      );
      const data = await res.json();
      if (data.message === false) {
        console.log(data.message);
        return;
      }
      console.log(data);
      setFormData(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchListing();
  }, []);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
          />
          <textarea
            onChange={handleChange}
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
          />
          <input
            onChange={handleChange}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                checked={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                checked={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                checked={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && <span>$ / month</span>}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  checked={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  <span className="text-xs">$ / month</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) =>
                setFiles((prev) => [...prev, ...Array.from(e.target.files)])
              }
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

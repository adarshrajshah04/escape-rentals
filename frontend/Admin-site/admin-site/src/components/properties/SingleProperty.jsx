
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosNew from "../../utils/axiosNew";
axiosNew

const SingleProperty = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);

                const response = await axiosNew.get(
                    `/properties/${propertyId}`
                );

                setProperty(response.data.data || response.data);
            } catch (error) {
                console.error("Property Fetch Error:", error);
                setError(
                    error.response?.data?.detail ||
                    "Unable to load property details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                Loading property details...
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">{String(error || "Property not found")}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-5 py-2 bg-primary text-white rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Maximum 5 images including cover image
    const propertyImages = [
        property.cover_image,
        ...(property.images || [])
    ].filter(Boolean).slice(0, 5);

    const getImageUrl = (path) => {
        return new URL(
            path.replace(/^\/+/, ""),
            axiosNew.defaults.baseURL
        ).toString();
    };

    return (
        <div className="p-6  bg-background min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-dark">
                        Property Details
                    </h1>
                    <p className="text-sm text-text-secondary mt-1">
                        View complete property information
                    </p>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2 rounded-lg border border-border
                    hover:bg-sidebar-bg transition"
                >
                    ← Back to Properties
                </button>
            </div>

            {/* Property Images */}
            <div className="bg-white rounded-xl p-5 shadow-sm mb-6">

                <h2 className="text-lg font-semibold mb-4">
                    Property Gallery
                </h2>

                {propertyImages.length > 0 ? (
                    <>
                        {/* Main Image */}
                        <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gray-100">
                            <img
                                src={getImageUrl(propertyImages[selectedImage])}
                                alt={property.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 mt-4 flex-wrap">
                            {propertyImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-24 h-20 rounded-lg overflow-hidden
                                    border-2 transition
                                    ${
                                        selectedImage === index
                                            ? "border-primary"
                                            : "border-transparent"
                                    }`}
                                >
                                    <img
                                        src={getImageUrl(image)}
                                        alt={`Property ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-text-secondary">
                        No images available.
                    </p>
                )}
            </div>

            {/* Property Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">

                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-dark">
                            {property.name}
                        </h2>
                        <p className="text-text-secondary mt-2">
                            📍 {property.location}
                        </p>
                    </div>

                    <span className={`px-4 py-2 rounded-full text-sm font-medium
                        ${property.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                        {property.is_active ? "Active" : "Inactive"}
                    </span>
                </div>

                <div className="border-t border-border pt-5">
                    <h3 className="font-semibold mb-2">
                        Description
                    </h3>

                    <p className="text-text-secondary leading-7">
                        {property.description}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">

                    <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-text-secondary">
                            Property ID
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            #{property.id}
                        </h3>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-text-secondary">
                            Category ID
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {property.category_id}
                        </h3>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-text-secondary">
                            Guest Capacity
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {property.guest_capacity} Guests
                        </h3>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-text-secondary">
                            Price Per Night
                        </p>
                        <h3 className="text-xl font-bold text-primary mt-1">
                            ₹{Number(property.price_per_night).toLocaleString("en-IN")}
                        </h3>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-text-secondary">
                            Total Images
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {propertyImages.length} / 5
                        </h3>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-text-secondary">
                            Status
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {property.is_active ? "Available" : "Unavailable"}
                        </h3>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SingleProperty;

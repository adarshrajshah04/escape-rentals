import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategory } from "../../redux/action/category.action";
import axiosNew from "../../utils/axiosNew";
import { useNavigate, useParams } from "react-router-dom";


const propertyValidation = Yup.object({
  // Category select karna compulsory hai
  category_id: Yup.number()
    .typeError("Please select a category")
    .required("Category is required")
    .moreThan(0, "Please select a valid category"),

  // Property name validation
  name: Yup.string()
    .trim()
    .required("Property name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

  // Description validation
  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(5, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  // Location validation
  location: Yup.string()
    .trim()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters"),

  // Price validation
  price_per_night: Yup.number()
    .typeError("Price must be a valid number")
    .required("Price is required")
    .moreThan(0, "Price must be greater than 0"),

  // Guest capacity validation
  guest_capacity: Yup.number()
    .typeError("Guest capacity must be a number")
    .required("Guest capacity is required")
    .integer("Guest capacity must be a whole number")
    .moreThan(0, "At least 1 guest is required")
    .max(100, "Guest capacity cannot exceed 100"),

  // Active / Inactive
  is_active: Yup.boolean().required("Please select property status"),

 
});

const UpdateProperties = () => {

    const {id}=useParams()
    
    
  const dispatch = useDispatch();

 
  const { category: categories } = useSelector((state) => state.category);
    const [update, setUpdate] = useState({})
    const navigate=useNavigate()
  useEffect(() => {
    dispatch(fetchCategory());
    axiosNew.get(`/properties/${id}`)
    .then((res)=>{
        
        setUpdate(res.data)
        
    })
  }, [dispatch,id]);
  return (
    <div>
      <div>
        <h1>Add properties</h1>
      </div>

      <Formik
      enableReinitialize
        initialValues={{
          category_id:update.category_id || "",
          name:update.name || "",
          description:update.description || "",
          location:update.location || "",
          price_per_night:update.price_per_night || "",
          guest_capacity:update.guest_capacity ||"",
          is_active:update.is_active|| true,
          cover_image: null,
          images: [],
        }}
        validationSchema={propertyValidation}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // FormData object create kar rahe hain
            const formData = new FormData();

            // Normal property fields
            formData.append("category_id", values.category_id);
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("price_per_night", values.price_per_night);
            formData.append("guest_capacity", values.guest_capacity);
            formData.append("is_active", values.is_active);

            // Cover image
            if (values.cover_image) {
              formData.append("cover_image", values.cover_image);
            }

            // Additional images
            values.images.forEach((image) => {
              if (image) {
                formData.append("images", image);
              }
            });

            // Backend API request
            const response = await axiosNew.put(`/properties/${id}`, formData);

            console.log("Property Created:", response.data);

            alert("Property Update successfully!");
            navigate("/properties")

            // Form reset
            resetForm();
          } catch (error) {
            console.error(
              "Property update Error:",
              error.response?.data || error,
            );

            alert(
              error.response?.data?.detail ||
                "Something went wrong while updating property.",
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => {
          
          const addImageField = () => {
            if (values.images.length >= 10) return;

            setFieldValue("images", [...values.images, null]);
          };

          
          const removeImageField = (index) => {
            setFieldValue(
              "images",
              values.images.filter((_, i) => i !== index),
            );
          };
          return (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* PROPERTY BASIC DETAILS */}
              <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">
                  Property Details
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Property Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter property name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Property Category *
                    </label>
                    <select
                      name="category_id"
                      value={values.category_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {touched.category_id && errors.category_id && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category_id}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Manali, Himachal Pradesh"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                    {touched.location && errors.location && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price Per Night (₹) *
                    </label>
                    <input
                      type="number"
                      name="price_per_night"
                      value={values.price_per_night}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Enter price"
                      min="1"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                    {touched.price_per_night && errors.price_per_night && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.price_per_night}
                      </p>
                    )}
                  </div>

                  {/* Guest Capacity */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Guest Capacity *
                    </label>
                    <input
                      type="number"
                      name="guest_capacity"
                      value={values.guest_capacity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Maximum guests"
                      min="1"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                    {touched.guest_capacity && errors.guest_capacity && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.guest_capacity}
                      </p>
                    )}
                  </div>

                  {/* Property Status */}
                  <div>
                    <label className="mb-2 block font-medium">
                      Property Status *
                    </label>

                    <select
                      name="is_active"
                      value={String(values.is_active)}
                      onChange={(e) =>
                        setFieldValue("is_active", e.target.value === "true")
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Property Description *
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe your property..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>
              </section>

              {/* PROPERTY IMAGES */}
              <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  Property Images
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Upload a cover image and additional property images.
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Cover Image */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cover Image *
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        setFieldValue(
                          "cover_image",
                          e.currentTarget.files?.[0] || null,
                        )
                      }
                      onBlur={() => setFieldTouched("cover_image", true)}
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                    />
                    {touched.cover_image && errors.cover_image && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cover_image}
                      </p>
                    )}
                  </div>

                  {/* Multiple Images */}
                  <div className="space-y-4">
                    <label className="font-medium">Property Images</label>

                    {values.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            setFieldValue(
                              `images[${index}]`,
                              e.currentTarget.files?.[0] || null,
                            );
                          }}
                          className="w-full rounded-lg border p-3"
                        />

                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="rounded-lg bg-red-500 px-4 py-2 text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addImageField}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                      + Add Image
                    </button>
                  </div>
                </div>
              </section>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-end gap-3">
                <button
                  type="reset"
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating Property..." : "Create Property"}
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateProperties;

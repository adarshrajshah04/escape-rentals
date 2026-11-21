import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import axiosNew from "../../utils/axiosNew";
import { useParams } from "react-router-dom";

const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name cannot exceed 50 characters")
    .required("Category name is required"),

  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),

  // image: Yup.mixed()
  //   .required("Category image is required")
  //   .test(
  //     "fileType",
  //     "Only JPG, JPEG, PNG and WEBP images are allowed",
  //     (value) => {
  //       if (!value) return false;

  //       return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
  //     },
  //   )
  //   .test("fileSize", "Image size must be less than 5MB", (value) => {
  //     if (!value) return true;

  //     return value.size <= 5 * 1024 * 1024;
  //   }),
});

const AddCategory = () => {
  const { id } = useParams();
  const [data, setdata] = useState({});
  useEffect(() => {
    axiosNew.get(`/categories/${id}`).then((res) => {
      // console.log(res.data.data);

      setdata(res.data.data);
    });
  }, [id]);

  return (
    <div>
      <h1 className="font-black text-3xl mb-10">Update category</h1>

      <Formik
        enableReinitialize
        initialValues={{
          name: data.name || "",
          description: data.description || "",
          is_active: data.is_active ?? true,
          image: null,
        }}
        validationSchema={categorySchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("is_active", String(values.is_active));
            if (values.image) {
              formData.append("image", values.image);
            }

            const res = await axiosNew.put(`/categories/${id}`, formData);

            alert("Category created successfully");
            resetForm();
            console.log(res.data);
          } catch (error) {
            const message =
              error.response?.data?.detail ||
              error.response?.data?.message ||
              error.message ||
              "Something went wrong";

            alert(message);
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
          isSubmitting,
          setFieldValue, // for file handling
        }) => (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* name and image */}
            <fieldset className="border border-gray-300 dark:border-gray-700 rounded-lg p-5">
              <legend className="px-2 text-lg font-medium">
                Category Details
              </legend>
              {/* name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Category name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-red-500">
                    {errors.name && touched.name && errors.name}
                  </p>
                </div>
                  {/* image */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Category Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setFieldValue("image", e.currentTarget.files[0] || null)
                    }
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2"
                  />
                  <p className=" text-blue-700">optional</p>
                  <p className="text-sm text-red-500">
                    {errors.image && touched.image && errors.image}
                  </p>
                </div>
                {/* is active */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Category Status</label>

                  <select
                    name="is_active"
                    value={String(values.is_active)}
                    onChange={(e) =>
                      setFieldValue("is_active", e.target.value === "true")
                    }
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  > 
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* description */}
            <fieldset className="border border-gray-300 dark:border-gray-700 rounded-lg p-5">
              <legend className="px-2 text-lg font-medium">Description</legend>

              <div className="flex flex-col gap-2">
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter description"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-32 resize-y"
                />
                <p className="text-sm text-red-500">
                  {errors.description &&
                    touched.description &&
                    errors.description}
                </p>
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddCategory;

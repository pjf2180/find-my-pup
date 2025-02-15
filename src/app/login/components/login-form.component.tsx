"use client";
import { login } from "@/app/api/endpoints/auth/login";
import clsx from "clsx";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const handleSubmit = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await login(formik.values.name, formik.values.email);
      router.replace("/");
    } catch {
      setError(
        new Error("There was an error creating your account please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { name: "", email: "" },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.name) {
        errors.name = "Required";
      } else if (values.name.length < 3) {
        errors.name = "Must be at least 3 characters";
      }
      return errors; // Return an object with field-specific errors
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form>
      <h2 className="text-2xl font-semibold mb-2">Create Your Account</h2>
      <p className="text-gray-500 text-sm mb-6">
        Get started to find your furry friend!
      </p>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Jan"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched.name && formik.errors.name && (
        <div style={{ color: "red" }}>{formik.errors.name}</div>
      )}
      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="me@doglove.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <button
        className={clsx("w-full bg-[rgba(105,38,96)] font-semibold text-[rgba(247,162,50)] py-3 rounded-md")} type="button"
        onClick={() => handleSubmit()}
      >
        {!loading && "Get Started Searching!"}
        {loading && "Creating your account"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}

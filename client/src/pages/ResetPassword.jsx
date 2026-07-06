import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../service/api";
import { API_ENDPOINTS, ROUTES } from "../utils/constants";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
      });

      setSuccess(response.data.message || "OTP sent to your email.");
      toast.success("OTP sent to your email. Check your inbox.");

      setTimeout(() => {
        navigate(ROUTES.VERIFY_OTP, { state: { email } });
      }, 800);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to send OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="max-w-md w-full bg-white/95 border border-slate-200 rounded-[32px] shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3 text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-100 text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 11v-2a4 4 0 0 0-4-4h-1" />
              <path d="M16 7h6" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Forgot password
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">
              Reset your password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your email and we’ll send a secure code to help you recover
              access.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="mt-7 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
          <p>
            Remembered your password?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

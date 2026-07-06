import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../service/api";
import { API_ENDPOINTS, ROUTES } from "../utils/constants";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp || !newPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp,
        newPassword,
      });

      setSuccess(response.data.message || "Password reset successful.");
      toast.success("Password reset successful. You can now sign in.");
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 900);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to verify OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="max-w-lg w-full bg-white/95 border border-slate-200 rounded-3xl shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Verify OTP
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Complete your password reset
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Enter the code sent to your email and choose a new password to
            continue.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">OTP code</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              autoComplete="one-time-code"
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              New password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? "Verifying..." : "Verify OTP & Reset"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
          <p>
            Back to{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import OTPModal from "../OTPModal";
import toast from "react-hot-toast";
import { useTranslation } from "@/app/hooks/useTranslation";

const Signin = () => {
  const { translate } = useTranslation();
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [formData, setFormData] = useState({
    identifier: "", // Can be email or phone
    password: "",
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isPhone = (value: string) => {
    return /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, "").length >= 10;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier) {
      toast.error(translate("auth.emailOrPhoneRequired"));
      return;
    }

    if (!formData.password) {
      toast.error(translate("auth.passwordRequired"));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await signInWithPassword(formData);
      toast.success(translate("auth.signedInSuccess"));
      // Redirect to dashboard or home
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier) {
      toast.error(translate("auth.emailOrPhoneRequired"));
      return;
    }

    if (isEmail(formData.identifier) && !isEmail(formData.identifier)) {
      toast.error(translate("auth.invalidEmail"));
      return;
    }

    if (!isEmail(formData.identifier) && !isPhone(formData.identifier)) {
      toast.error(translate("auth.invalidEmailOrPhone"));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to send OTP
      // await sendOTP(identifier);
      toast.success(translate("auth.otpSentSuccess"));
      setShowOTPModal(true);
      setOtpError("");
    } catch (error: any) {
      toast.error(error.message || translate("auth.failedToSendOTP"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);
    setOtpError("");
    
    try {
      // TODO: Replace with actual API call to verify OTP and login
      // await verifyOTPAndLogin(formData.identifier, otp);
      toast.success(translate("auth.signedInSuccess"));
      setShowOTPModal(false);
      // Redirect to dashboard or home
    } catch (error: any) {
      setOtpError(error.message || translate("auth.invalidVerificationCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to resend OTP
      // await sendOTP(formData.identifier);
      toast.success(translate("auth.otpResentSuccess"));
      setOtpError("");
    } catch (error: any) {
      toast.error(error.message || translate("auth.failedToResendOTP"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (loginMethod === "password") {
      handlePasswordLogin(e);
    } else {
      handleOTPLogin(e);
    }
  };

  return (
    <>
      <Breadcrumb title={translate("auth.signIn")} pages={[translate("auth.signIn")]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                {translate("auth.signInToAccountTitle")}
              </h2>
              <p>{translate("auth.enterDetailsBelow")}</p>
            </div>

            {/* Login Method Toggle */}
            <div className="mb-6 flex gap-2 p-1 bg-gray-1 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all duration-200 ${
                  loginMethod === "password"
                    ? "bg-white text-dark shadow-sm"
                    : "text-dark-4 hover:text-dark"
                }`}
              >
                {translate("auth.passwordMethod")}
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("otp")}
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all duration-200 ${
                  loginMethod === "otp"
                    ? "bg-white text-dark shadow-sm"
                    : "text-dark-4 hover:text-dark"
                }`}
              >
                {translate("auth.otpMethod")}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="identifier" className="block mb-2.5">
                  {translate("auth.emailOrPhone")}
                </label>
                <input
                  type="text"
                  name="identifier"
                  id="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder={translate("auth.emailOrPhonePlaceholder")}
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              {loginMethod === "password" && (
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    {translate("auth.password")}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={translate("auth.passwordPlaceholder")}
                    autoComplete="current-password"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              )}

              {loginMethod === "password" && (
                <a
                  href="#"
                  className="block text-center text-dark-4 mb-4.5 ease-out duration-200 hover:text-dark"
                >
                  {translate("auth.forgotPassword")}
                </a>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-dark"
              >
                {isLoading
                  ? translate("auth.processing")
                  : loginMethod === "password"
                  ? translate("auth.signInToAccount")
                  : translate("auth.sendOTPCode")}
              </button>

              <span className="relative z-1 block font-medium text-center mt-4.5">
                <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>
                <span className="inline-block px-3 bg-white">{translate("auth.or")}</span>
              </span>

              <div className="flex flex-col gap-4.5 mt-4.5">
                <button
                  type="button"
                  className="flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_98_7461)">
                      <mask
                        id="mask0_98_7461"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                      >
                        <path d="M20 0H0V20H20V0Z" fill="white" />
                      </mask>
                      <g mask="url(#mask0_98_7461)">
                        <path
                          d="M19.999 10.2218C20.0111 9.53429 19.9387 8.84791 19.7834 8.17737H10.2031V11.8884H15.8267C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.999 13.2661 19.999 10.2218Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2036 20C12.9586 20 15.2715 19.1111 16.9609 17.5777L13.7409 15.1332C12.8793 15.7223 11.7229 16.1333 10.2036 16.1333C8.91317 16.126 7.65795 15.7206 6.61596 14.9746C5.57397 14.2287 4.79811 13.1802 4.39848 11.9777L4.2789 11.9877L1.12906 14.3766L1.08789 14.4888C1.93622 16.1457 3.23812 17.5386 4.84801 18.512C6.45791 19.4852 8.31194 20.0005 10.2036 20Z"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9776C4.1758 11.3411 4.06063 10.673 4.05807 9.9999C4.06218 9.3279 4.1731 8.66067 4.38684 8.02221L4.38115 7.88959L1.1927 5.46234L1.0884 5.51095C0.372762 6.90337 0 8.44075 0 9.99983C0 11.5589 0.372762 13.0962 1.0884 14.4887L4.39899 11.9776Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2039 3.86663C11.6661 3.84438 13.0802 4.37803 14.1495 5.35558L17.0294 2.59997C15.1823 0.90185 12.7364 -0.0298855 10.2039 -3.67839e-05C8.31239 -0.000477835 6.45795 0.514733 4.84805 1.48799C3.23816 2.46123 1.93624 3.85417 1.08789 5.51101L4.38751 8.02225C4.79107 6.82005 5.5695 5.77231 6.61303 5.02675C7.65655 4.28119 8.91254 3.87541 10.2039 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_98_7461">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                    {translate("auth.signInWithGoogle")}
                </button>

                <button
                  type="button"
                  className="flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9997 1.83331C5.93773 1.83331 1.83301 6.04119 1.83301 11.232C1.83301 15.3847 4.45954 18.9077 8.10178 20.1505C8.55988 20.2375 8.72811 19.9466 8.72811 19.6983C8.72811 19.4743 8.71956 18.7338 8.71567 17.9485C6.16541 18.517 5.6273 16.8395 5.6273 16.8395C5.21032 15.7532 4.60951 15.4644 4.60951 15.4644C3.77785 14.8811 4.6722 14.893 4.6722 14.893C5.59272 14.9593 6.07742 15.8615 6.07742 15.8615C6.89499 17.2984 8.22184 16.883 8.74493 16.6429C8.82718 16.0353 9.06478 15.6208 9.32694 15.3861C7.2909 15.1484 5.15051 14.3425 5.15051 10.7412C5.15051 9.71509 5.5086 8.87661 6.09503 8.21844C5.99984 7.98167 5.68611 7.02577 6.18382 5.73115C6.18382 5.73115 6.95358 5.47855 8.70532 6.69458C9.43648 6.48627 10.2207 6.3819 10.9997 6.37836C11.7787 6.3819 12.5635 6.48627 13.2961 6.69458C15.0457 5.47855 15.8145 5.73115 15.8145 5.73115C16.3134 7.02577 15.9995 7.98167 15.9043 8.21844C16.4921 8.87661 16.8477 9.715 16.8477 10.7412C16.8477 14.351 14.7033 15.146 12.662 15.3786C12.9909 15.6702 13.2838 16.2423 13.2838 17.1191C13.2838 18.3766 13.2732 19.3888 13.2732 19.6983C13.2732 19.9485 13.4382 20.2415 13.9028 20.1492C17.5431 18.905 20.1663 15.3833 20.1663 11.232C20.1663 6.04119 16.0621 1.83331 10.9997 1.83331Z"
                      fill="#15171A"
                    />
                  </svg>
                    {translate("auth.signInWithGithub")}
                </button>
              </div>

              <p className="text-center mt-6">
                {translate("auth.dontHaveAccount")}
                <Link
                  href="/signup"
                  className="text-dark ease-out duration-200 hover:text-blue pl-2"
                >
                  {translate("auth.signUpNow")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setOtpError("");
        }}
        onSubmit={handleOTPVerify}
        phoneOrEmail={formData.identifier}
        isLoading={isLoading}
        error={otpError}
        onResend={handleResendOTP}
      />
    </>
  );
};

export default Signin;

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/app/hooks/useTranslation";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  phoneOrEmail: string;
  isLoading?: boolean;
  error?: string;
  onResend?: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  phoneOrEmail,
  isLoading = false,
  error,
  onResend,
}) => {
  const { translate } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp.slice(0, 6));
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onSubmit(otpString);
    }
  };

  const handleResend = () => {
    if (countdown === 0 && onResend) {
      setCountdown(60);
      onResend();
    }
  };

  useEffect(() => {
    // Close modal when clicking outside
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(".otp-modal-content")) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 z-99999">
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-[500px] rounded-xl shadow-3 bg-white p-7.5 relative otp-modal-content">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-gray-1 text-body hover:text-dark hover:bg-gray-2"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="text-center mb-6">
            <h2 className="font-semibold text-xl sm:text-2xl text-dark mb-2">
              {translate("auth.enterVerificationCode")}
            </h2>
            <p className="text-dark-4 text-sm">
              {translate("auth.otpSentTo")}
            </p>
            <p className="text-dark font-medium mt-1">{phoneOrEmail}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 border-gray-3 bg-gray-1 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red/10 border border-red/20">
                <p className="text-red text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={otp.join("").length !== 6 || isLoading}
              className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-dark"
            >
              {isLoading ? translate("auth.verifying") : translate("auth.verifyCode")}
            </button>

            <div className="mt-4 text-center">
              <p className="text-dark-4 text-sm mb-2">
                {translate("auth.didntReceiveCode")}
              </p>
              {countdown > 0 ? (
                <p className="text-dark-4 text-sm">
                  {translate("auth.resendCodeIn")} <span className="font-medium text-dark">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue font-medium text-sm hover:underline"
                >
                  {translate("auth.resendCode")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;

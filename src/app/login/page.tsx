"use client";

import { signIn } from "next-auth/react";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Map NextAuth error codes to Japanese messages
const errorMessages: Record<string, string> = {
  Configuration: "サーバーの設定に問題があります。管理者にお問い合わせください。",
  AccessDenied: "アクセスが拒否されました。",
  Verification: "認証リンクの有効期限が切れています。",
  OAuthSignin: "OAuth認証の開始に失敗しました。",
  OAuthCallback: "OAuth認証の処理中にエラーが発生しました。",
  OAuthCreateAccount: "アカウントの作成に失敗しました。",
  EmailCreateAccount: "アカウントの作成に失敗しました。",
  Callback: "認証コールバックでエラーが発生しました。",
  OAuthAccountNotLinked: "このメールアドレスは別の方法でログインされています。",
  EmailSignin: "メール送信に失敗しました。",
  CredentialsSignin: "ログインに失敗しました。サーバーへの接続を確認してください。",
  SessionRequired: "ログインが必要です。",
  Default: "ログイン中にエラーが発生しました。しばらくしてからもう一度お試しください。",
};

// Component that uses useSearchParams - must be wrapped in Suspense
function LoginContent() {
  const [isLoading, setIsLoading] = useState<"google" | "guest" | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Derive error from URL params (for redirects from auth errors)
  const urlError = useMemo(() => {
    const error = searchParams.get("error");
    if (error) {
      console.error("Auth error from URL:", error);
      return errorMessages[error] || errorMessages.Default;
    }
    return null;
  }, [searchParams]);

  // Show runtime error if present, otherwise show URL error
  const errorMessage = runtimeError || urlError;

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    setRuntimeError(null);
    // ログイン時にレビュープロンプト表示フラグを設定
    sessionStorage.setItem('showReviewPrompt', 'true');
    await signIn("google", { callbackUrl: "/collection" });
  };

  const handleGuestLogin = async () => {
    setIsLoading("guest");
    setRuntimeError(null);
    // ログイン時にレビュープロンプト表示フラグを設定
    sessionStorage.setItem('showReviewPrompt', 'true');
    try {
      // localStorageから既存のゲストIDを取得
      const existingGuestId = typeof window !== 'undefined'
        ? localStorage.getItem("guestUserId")
        : null;

      const result = await signIn("guest", {
        guestId: existingGuestId || "",
        callbackUrl: "/collection",
        redirect: false
      });
      if (result?.error) {
        console.error("Guest login error:", result.error);
        setRuntimeError(errorMessages[result.error] || errorMessages.Default);
        setIsLoading(null);
      } else if (result?.ok) {
        window.location.href = "/collection";
      } else {
        // Handle case where result is not ok and no error
        console.error("Guest login returned unexpected result:", result);
        setRuntimeError(errorMessages.Default);
        setIsLoading(null);
      }
    } catch (error) {
      console.error("Guest login error:", error);
      setRuntimeError(errorMessages.Default);
      setIsLoading(null);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo & Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center">
          <Image
            src="/icon.svg"
            alt="モノコレクター"
            width={80}
            height={80}
            className="rounded-2xl shadow-lg"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          モノコレクター
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          家にあるモノを楽しく管理
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">ログインエラー</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Login Buttons */}
      <div className="space-y-3">
        {/* Google Sign-In - Googleブランドガイドライン準拠 */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading !== null}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-zinc-300 rounded-lg text-zinc-700 font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading === "google" ? (
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-500">
              または
            </span>
          </div>
        </div>

        {/* Guest Login */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoading !== null}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === "guest" ? (
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          <span>ゲストとして始める</span>
        </button>
      </div>

      {/* Notice */}
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        ゲストデータは同じブラウザで保持されます。
        <br />
        Googleアカウントでログインすると、ゲストデータを引き継げます。
      </p>

      {/* Legal Links */}
      <div className="text-center space-y-2">
        <div className="flex justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300 underline">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300 underline">
            プライバシーポリシー
          </Link>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
          ログインすることで、
          <Link href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-400">利用規約</Link>
          と
          <Link href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-400">プライバシーポリシー</Link>
          に同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
      <Suspense fallback={
        <div className="w-full max-w-sm flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}

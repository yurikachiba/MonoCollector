'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { X, ArrowRight, Package, AlertCircle, Check } from 'lucide-react';
import { useGuestInfo, useGuestMigration } from '@/hooks/useGuestMigration';

export default function GuestDataMigrationDialog() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const hasChecked = useRef(false);

  // 初期化時にゲストIDを取得
  useEffect(() => {
    // セッションがloading中の場合は待機
    if (status === 'loading') return;

    // 認証されていない場合は何もしない
    if (status === 'unauthenticated' || !session?.user?.id) return;

    // ゲストユーザーの場合は何もしない
    if (session.user.isGuest === true) return;

    // 既にチェック済みの場合はスキップ
    if (hasChecked.current) return;
    hasChecked.current = true;

    // localStorageからゲストIDを取得
    if (typeof window === 'undefined') return;
    const storedGuestId = localStorage.getItem('guestUserId');
    if (!storedGuestId) {
      console.log('[GuestMigration] No guest ID found in localStorage');
      return;
    }

    // 現在のユーザーIDと同じ場合は何もしない
    if (storedGuestId === session.user.id) {
      console.log('[GuestMigration] Guest ID matches current user, skipping');
      return;
    }

    console.log('[GuestMigration] Found guest ID:', storedGuestId);
    setGuestId(storedGuestId);
  }, [session, status]);

  // TanStack Queryでゲスト情報を取得
  const { data: guestInfo, isLoading } = useGuestInfo(guestId, !!guestId);

  // ゲスト情報取得後にダイアログを表示
  useEffect(() => {
    if (!isLoading && guestInfo) {
      if (guestInfo.exists && guestInfo.itemCount && guestInfo.itemCount > 0) {
        setIsOpen(true);
      } else {
        // ゲストIDが無効またはアイテムが0個の場合はlocalStorageから削除
        console.log('[GuestMigration] Guest not found or has no items, removing from localStorage');
        localStorage.removeItem('guestUserId');
      }
    }
  }, [guestInfo, isLoading]);

  // TanStack Queryでマイグレーション実行
  const migrationMutation = useGuestMigration();

  const handleMigrate = async () => {
    if (!guestId) return;

    try {
      await migrationMutation.mutateAsync(guestId);
      // localStorageからゲストIDを削除
      localStorage.removeItem('guestUserId');
      // 2秒後にダイアログを閉じてページをリロード
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to migrate guest data:', error);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    // スキップした場合もlocalStorageから削除（次回表示させない）
    localStorage.removeItem('guestUserId');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || isLoading || !guestInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
        {/* ヘッダー */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ゲストデータの引き継ぎ
          </h2>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4">
          {migrationMutation.isSuccess ? (
            // 成功表示
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <Check className="w-6 h-6 flex-shrink-0" />
              <p>データを引き継ぎました</p>
            </div>
          ) : migrationMutation.isError ? (
            // エラー表示
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p>{migrationMutation.error?.message || 'データの引き継ぎに失敗しました'}</p>
            </div>
          ) : (
            <>
              {/* 説明 */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                以前ゲストとして使用していたデータがあります。このアカウントに引き継ぎますか？
              </p>

              {/* ゲストデータ情報 */}
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {guestInfo.guestName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {guestInfo.itemCount}個のアイテム
                    </p>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  disabled={migrationMutation.isPending}
                  className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  スキップ
                </button>
                <button
                  onClick={handleMigrate}
                  disabled={migrationMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  {migrationMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>引き継ぐ</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* フッター注意事項 */}
        {!migrationMutation.isSuccess && !migrationMutation.isError && (
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              スキップするとゲストデータは削除されます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, ArrowRight, Package, AlertCircle, Check } from 'lucide-react';

interface GuestInfo {
  exists: boolean;
  guestName?: string;
  itemCount?: number;
  createdAt?: string;
}

export default function GuestDataMigrationDialog() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);

  // 初期化時にゲストデータをチェック
  useEffect(() => {
    const checkGuestData = async () => {
      // ゲストユーザーの場合は何もしない
      if (!session?.user?.id || session.user.isGuest) {
        return;
      }

      // localStorageからゲストIDを取得
      const storedGuestId = localStorage.getItem('guestUserId');
      if (!storedGuestId) {
        return;
      }

      setGuestId(storedGuestId);
      setIsLoading(true);

      try {
        const response = await fetch(`/api/auth/link-guest?guestId=${encodeURIComponent(storedGuestId)}`);
        const data = await response.json();

        if (data.exists && data.itemCount > 0) {
          setGuestInfo(data);
          setIsOpen(true);
        } else if (!data.exists) {
          // ゲストIDが無効な場合はlocalStorageから削除
          localStorage.removeItem('guestUserId');
        }
      } catch (error) {
        console.error('Failed to check guest data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkGuestData();
  }, [session]);

  const handleMigrate = async () => {
    if (!guestId) return;

    setIsMigrating(true);
    try {
      const response = await fetch('/api/auth/link-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMigrationResult({ success: true, message: data.message });
        // localStorageからゲストIDを削除
        localStorage.removeItem('guestUserId');
        // 3秒後にダイアログを閉じてページをリロード
        setTimeout(() => {
          setIsOpen(false);
          window.location.reload();
        }, 2000);
      } else {
        setMigrationResult({ success: false, message: data.error });
      }
    } catch (error) {
      console.error('Failed to migrate guest data:', error);
      setMigrationResult({ success: false, message: 'データの引き継ぎに失敗しました' });
    } finally {
      setIsMigrating(false);
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

  if (!isOpen || isLoading) {
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
          {migrationResult ? (
            // 結果表示
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              migrationResult.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {migrationResult.success ? (
                <Check className="w-6 h-6 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <p>{migrationResult.message}</p>
            </div>
          ) : (
            <>
              {/* 説明 */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                以前ゲストとして使用していたデータがあります。このアカウントに引き継ぎますか？
              </p>

              {/* ゲストデータ情報 */}
              {guestInfo && (
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
              )}

              {/* アクションボタン */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  disabled={isMigrating}
                  className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  スキップ
                </button>
                <button
                  onClick={handleMigrate}
                  disabled={isMigrating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  {isMigrating ? (
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
        {!migrationResult && (
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

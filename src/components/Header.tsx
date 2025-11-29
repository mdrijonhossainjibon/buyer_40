'use client'

import { useEffect, useState } from 'react'
  
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'modules'
 
 
 
 

export default function Header( ) {
    
  const user = useSelector((state: RootState) => state.user);
  const [photoUrl, setPhotoUrl] = useState<string>("https://picsum.photos/60/60?random=1");
   

 
  // Function to format numbers with K, M, B suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // Function to get display name with intelligent handling
  const getDisplayName = () => {
    const tgUser = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user : null;
    
    // Check if we have first name or last name from Telegram
    const firstName = tgUser?.first_name;
    const lastName = tgUser?.last_name;
    
    let displayName = '';
    
    if (firstName || lastName) {
      // If we have first or last name, show username instead
      displayName = firstName + '' + lastName || tgUser?.username || 'User';
    } else {
      // If no first/last name, use username or fallback
      displayName = user.username || user.userId?.toString() || 'Guest';
    }
    
    // Handle long names with substring (max 15 characters)
    if (displayName.length > 15) {
      return displayName.substring(0, 15) + '...';
    }
    
    return displayName;
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tgPhoto = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url;
      
      if (tgPhoto) {
        setPhotoUrl(tgPhoto);
      }
    }
  }, []);

 

  return (
    <header className="bg-white dark:bg-[#0B0E11] border-b border-gray-200 dark:border-gray-800/50 sticky top-0 z-40 backdrop-blur-xl">
      {/* Binance Yellow Accent Line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#F0B90B] to-transparent"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0B90B]/5 to-transparent pointer-events-none"></div>
      
      {/* Main Header Row - Binance Style */}
      <div className="relative px-4 py-3 flex items-center justify-between min-h-[75px]">
        {/* Left Section - Back Button or User Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!true && (
            <button
            
              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all flex-shrink-0 backdrop-blur-sm"
            >
              <i className="fas fa-arrow-left text-gray-700 dark:text-gray-300 text-sm"></i>
            </button>
          )}
          
          {/* User Avatar with Binance-style Ring */}
          <div className="relative flex-shrink-0">
            {/* Outer glow ring */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#F0B90B] to-[#F8D12F] rounded-full opacity-75 blur-sm"></div>
            
            <div className="relative">
              <img 
                className="w-14 h-14 rounded-full object-cover border-2 border-[#F0B90B] shadow-lg relative z-10" 
                src={photoUrl}
                alt="User" 
              />
              {/* Rotating gradient ring */}
              <div 
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                  background: 'conic-gradient(from 0deg, #F0B90B, #F8D12F, #F0B90B)',
                  animation: 'spin 3s linear infinite',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />
            </div>
            
            {/* Online Status - Binance Yellow */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#F0B90B] rounded-full border-2 border-white dark:border-[#0B0E11] shadow-lg z-20">
              <div className="absolute inset-0 bg-[#F0B90B] rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          
          {/* User Info - Binance Style */}
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            {/* Name Row */}
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-900 dark:text-white truncate tracking-tight">
                {getDisplayName()}
              </h1>
              {/* Verified Badge - Gold */}
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#F8D12F] flex items-center justify-center shadow-md">
                <i className="fas fa-check text-white dark:text-[#0B0E11] text-[8px] font-bold"></i>
              </div>
              {/* VIP Badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#F0B90B]/20 to-[#F8D12F]/20 border border-[#F0B90B]/30 rounded">
                <i className="fas fa-crown text-[#F0B90B] text-[8px]"></i>
                <span className="text-[9px] font-bold text-[#F0B90B] tracking-wider">VIP</span>
              </div>
            </div>
            
            {/* Balance Row - Binance Style */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* USDT Balance */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/80 dark:to-gray-900/80 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-800 dark:hover:to-gray-900 rounded-lg border border-gray-300 dark:border-gray-700/50 shadow-sm backdrop-blur-sm transition-all group cursor-pointer">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#26A17B] to-[#1E8E6A] flex items-center justify-center shadow-sm">
                  <i className="fas fa-dollar-sign text-white text-[10px]"></i>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F0B90B] transition-colors">
                    {formatNumber(user.wallet.available.usdt || 0)}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                    USDT
                  </span>
                </div>
                <i className="fas fa-chevron-right text-[8px] text-gray-400 dark:text-gray-500 group-hover:text-[#F0B90B] transition-colors"></i>
              </div>
              
              {/* XP Badge - Binance Gold */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#F0B90B]/10 to-[#F8D12F]/10 hover:from-[#F0B90B]/20 hover:to-[#F8D12F]/20 rounded-lg border border-[#F0B90B]/30 shadow-sm backdrop-blur-sm transition-all group cursor-pointer">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#F0B90B] to-[#F8D12F] flex items-center justify-center shadow-md">
                  <i className="fas fa-star text-white dark:text-[#0B0E11] text-[10px]"></i>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-[#F0B90B] group-hover:text-[#F8D12F] transition-colors">
                    {formatNumber(user.wallet.available.xp || 0)}
                  </span>
                  <span className="text-[10px] font-semibold text-[#F0B90B]/70">
                    XP
                  </span>
                </div>
                <i className="fas fa-chevron-right text-[8px] text-[#F0B90B]/50 group-hover:text-[#F0B90B] transition-colors"></i>
              </div>
            </div>
          </div>
        </div>

      </div>
      
       
    </header>
  )
}

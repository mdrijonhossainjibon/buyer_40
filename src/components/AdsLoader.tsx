'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { fetchAdsSettingsRequest } from '@/store/modules/adsSettings'

interface AdsLoaderProps {
  children?: React.ReactNode
}

// Global ads interface for TypeScript
declare global {
  interface Window {
    gigapub?: any
    monetag?: any
    adsbygoogle?: any
    showAd?: (zoneId: string) => void
    initializeAds?: () => void
  }
}

export default function AdsLoader({ children }: AdsLoaderProps) {
  const dispatch = useDispatch()
  const adsSettings = useSelector((state: RootState) => state.adsSettings)
  const [adsInitialized, setAdsInitialized] = useState(false)

  // Load ads settings on component mount
  useEffect(() => {
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])

  // Initialize ads when settings are loaded
  useEffect(() => {
    if (!adsSettings.isLoading && !adsInitialized) {
      initializeAdsSystem()
      setAdsInitialized(true)
    }
  }, [adsSettings.isLoading, adsInitialized])

  const initializeAdsSystem = () => {
    // Initialize global ads functions
    window.initializeAds = () => {
      console.log('Ads system initialized')
    }

    window.showAd = (zoneId: string) => {
      console.log(`Showing ad for zone: ${zoneId}`)
      // This will be called when user watches an ad
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, adsSettings.minWatchTime * 1000)
      })
    }
  }

  const handleGigaPubLoad = () => {
    if (adsSettings.enableGigaPubAds && window.gigapub) {
      console.log('GigaPub ads loaded successfully')
      window.initializeAds?.()
    }
  }

  const handleMonetagLoad = () => {
    if (adsSettings.monetagEnabled && window.monetag) {
      console.log('Monetag ads loaded successfully')
    }
  }

  const handleScriptError = (scriptName: string) => {
    console.error(`Failed to load ${scriptName} ads script`)
  }

  return (
    <>
      {/* GigaPub Ads - Load if enabled and has app ID */}
      {adsSettings.enableGigaPubAds && adsSettings.adsWatchLimit > 0 && (
        <>
          <Script
            src="//libtl.com/sdk.js"
            data-zone="9890517"
            data-sdk="show_9890517"
            strategy="afterInteractive"
            onLoad={handleGigaPubLoad}
            onError={() => handleScriptError('GigaPub')}
          />
          
         
        </>
      )}

      {/* Monetag Ads - Load if enabled and has zone ID */}
      {adsSettings.monetagEnabled && (
        <Script
          src="//d2oh4tlt9mrke9.cloudfront.net/Record/js/moneytag-banner-api.js"
          strategy="afterInteractive"
          onLoad={handleMonetagLoad}
          onError={() => handleScriptError('Monetag')}
        />
      )}
 

      {children}
    </>
  )
}

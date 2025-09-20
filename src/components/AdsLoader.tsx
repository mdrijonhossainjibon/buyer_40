'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { fetchAdsSettingsRequest } from '@/store/modules/adsSettings'

interface AdsLoaderProps {
  children?: React.ReactNode
}

export default function AdsLoader({ children }: AdsLoaderProps) {
  const dispatch = useDispatch()
  const adsSettings = useSelector((state: RootState) => state.adsSettings)
  const [scriptsLoaded, setScriptsLoaded] = useState({
    gigaPub: false,
    monetag: false
  })

  // Load ads settings on component mount
  useEffect(() => {
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])

  const handleGigaPubLoad = () => {
    if (adsSettings.enableGigaPubAds) {
      console.log('GigaPub ads loaded successfully')
      setScriptsLoaded(prev => ({ ...prev, gigaPub: true }))
      
      // Initialize GigaPub if available
      if (typeof window !== 'undefined' && window.showGiga) {
        console.log('GigaPub showGiga function is available')
      }
    }
  }

  const handleMonetagLoad = () => {
    if (adsSettings.monetagEnabled) {
      console.log('Monetag ads loaded successfully')
      setScriptsLoaded(prev => ({ ...prev, monetag: true }))
      
      // Initialize Monetag if available
      if (typeof window !== 'undefined' && adsSettings.monetagZoneId) {
        const monetagFunction = `show_${adsSettings.monetagZoneId}`
        if ((window as any)[monetagFunction]) {
          console.log(`Monetag ${monetagFunction} function is available`)
        }
      }
    }
  }

  const handleScriptError = (scriptName: string) => {
    console.error(`Failed to load ${scriptName} ads script`)
    // Reset the loading state for the failed script
    if (scriptName === 'GigaPub') {
      setScriptsLoaded(prev => ({ ...prev, gigaPub: false }))
    } else if (scriptName === 'Monetag') {
      setScriptsLoaded(prev => ({ ...prev, monetag: false }))
    }
  }

  // Expose ad functions globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Expose GigaPub function
      if (scriptsLoaded.gigaPub && adsSettings.enableGigaPubAds && window.showGiga) {
        (window as any).showGigaAd = window.showGiga
      }
      
      // Expose Monetag function
      if (scriptsLoaded.monetag && adsSettings.monetagEnabled && adsSettings.monetagZoneId) {
        const monetagFunction = `show_${adsSettings.monetagZoneId}`
        if ((window as any)[monetagFunction]) {
          (window as any).showMonetagAd = (window as any)[monetagFunction]
        }
      }
    }
  }, [scriptsLoaded, adsSettings])

  return (
    <>
      {/* GigaPub Ads Script */}
      {adsSettings.enableGigaPubAds && adsSettings.gigaPubAppId && (
        <Script
          src={`https://ad.gigapub.tech/script?id=${adsSettings.gigaPubAppId}`}
          strategy="afterInteractive"
          onLoad={handleGigaPubLoad}
          onError={() => handleScriptError('GigaPub')}
        />
      )}

      {/* Monetag Ads Script */}
      {adsSettings.monetagEnabled && adsSettings.monetagZoneId && (
        <Script
          src="//libtl.com/sdk.js"
          data-zone={adsSettings.monetagZoneId}
          data-sdk={`show_${adsSettings.monetagZoneId}`}
          strategy="afterInteractive"
          onLoad={handleMonetagLoad}
          onError={() => handleScriptError('Monetag')}
        />
      )}

      {children}
    </>
  )
}

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
  

  console.log(adsSettings)
  // Load ads settings on component mount
  useEffect(() => {
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])
 

  const handleGigaPubLoad = () => {
    if (adsSettings.enableGigaPubAds ) {
      console.log('GigaPub ads loaded successfully')
 
    }
  }

  const handleMonetagLoad = () => {
    if (adsSettings.monetagEnabled ) {
      console.log('Monetag ads loaded successfully')
    }
  }

  const handleScriptError = (scriptName: string) => {
    console.error(`Failed to load ${scriptName} ads script`)
  }

  return (
    <>
      {/* GigaPub Ads - Load if enabled and has app ID */}
      {adsSettings.enableGigaPubAds && (
        <>
          <Script
            src={`https://ad.gigapub.tech/script?id=${adsSettings.gigaPubAppId}`}
            strategy="afterInteractive"
            onLoad={handleGigaPubLoad}
            onError={() => handleScriptError('GigaPub')}
          />


        </>
      )}

      {/* Monetag Ads - Load if enabled and has zone ID */}
      {adsSettings.monetagEnabled && (
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

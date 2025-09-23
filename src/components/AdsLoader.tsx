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

  useEffect(() => {
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])

  return (
    <>
      {adsSettings.enableGigaPubAds && (
        <Script src={`https://ad.gigapub.tech/script?id=${adsSettings.gigaPubAppId}`} />
      )}

      {adsSettings.monetagEnabled && (
        <Script src='//libtl.com/sdk.js' data-zone={adsSettings.monetagZoneId} data-sdk={'show_' + adsSettings.monetagZoneId} />
      )}

      <Script src='https://adexora.com/cdn/ads.js?id=310' />





      {children}
    </>
  )
}

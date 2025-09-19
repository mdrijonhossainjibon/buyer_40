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


  // Load ads settings on component mount
  useEffect(() => {
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])


  const handleGigaPubLoad = () => {
    if (adsSettings.enableGigaPubAds) {
      console.log('GigaPub ads loaded successfully')

    }
  }

  const handleMonetagLoad = () => {
    if (adsSettings.monetagEnabled) {
      console.log('Monetag ads loaded successfully')
    }
  }

  const handleScriptError = (scriptName: string) => {
    console.error(`Failed to load ${scriptName} ads script`)
  }

  return (
    <>
    

     

      {children}
    </>
  )
}

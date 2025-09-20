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
 
  return (
    <>
        <Script src="https://ad.gigapub.tech/script?id=3085" />

        <Script src='//libtl.com/sdk.js' data-zone='9890517' data-sdk='show_9890517' />
      {children}
    </>
  )
}

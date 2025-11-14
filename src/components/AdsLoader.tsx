'use client'

import { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { fetchAdsSettingsRequest } from 'modules/adsSettings'
import { RootState } from 'modules'
import AdScriptLoader from './AdScriptLoader'

interface AdsLoaderProps {
    children?: React.ReactNode
}

export default function AdsLoader({ children }: AdsLoaderProps) {
    const dispatch = useDispatch()
    const adsSettings = useSelector((state: RootState) => state.adsSettings)
   console.log(adsSettings)
    useEffect(() => {
        dispatch(fetchAdsSettingsRequest())
    }, [dispatch])

    return (
        <>
           <AdScriptLoader zoneId={adsSettings.monetagZoneId} scriptId={`ad-script-${adsSettings.monetagZoneId}`} />
            {children}
        </>
    )
}

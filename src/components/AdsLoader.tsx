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
            <AdScriptLoader type='libtl' zoneId={adsSettings.monetagZoneId} scriptId={`ad-script-${adsSettings.monetagZoneId}`} />
            <AdScriptLoader type='gigapub' zoneId={adsSettings.gigaPubAppId} scriptId={`ad-script-${adsSettings.gigaPubAppId}`} />
            <AdScriptLoader type='adexora' zoneId={adsSettings.monetagZoneId} scriptId={`ad-script-310`} />
            {children}
        </>
    )
}

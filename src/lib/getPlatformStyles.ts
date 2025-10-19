// Auto-detect platform styles
export const getPlatformStyles = (platform: string) => {
  const platforms: Record<string, {
    icon: string
    iconColor: string
    buttonColor: string
    buttonLabel: string
  }> = {
    telegram: {
      icon: 'fab fa-telegram',
      iconColor: 'text-blue-500',
      buttonColor: '#0088cc',
      buttonLabel: 'Open Channel'
    },
    youtube: {
      icon: 'fab fa-youtube',
      iconColor: 'text-red-600',
      buttonColor: '#ff0000',
      buttonLabel: 'Open YouTube'
    },
    twitter: {
      icon: 'fab fa-twitter',
      iconColor: 'text-blue-400',
      buttonColor: '#1DA1F2',
      buttonLabel: 'Open Twitter'
    },
    instagram: {
      icon: 'fab fa-instagram',
      iconColor: 'text-pink-600',
      buttonColor: '#E4405F',
      buttonLabel: 'Open Instagram'
    },
    discord: {
      icon: 'fab fa-discord',
      iconColor: 'text-indigo-600',
      buttonColor: '#5865F2',
      buttonLabel: 'Open Discord'
    },
    tiktok: {
      icon: 'fab fa-tiktok',
      iconColor: 'text-gray-900 dark:text-white',
      buttonColor: '#000000',
      buttonLabel: 'Open TikTok'
    },
    facebook: {
      icon: 'fab fa-facebook',
      iconColor: 'text-blue-600',
      buttonColor: '#1877F2',
      buttonLabel: 'Open Facebook'
    },
    reddit: {
      icon: 'fab fa-reddit',
      iconColor: 'text-orange-600',
      buttonColor: '#FF4500',
      buttonLabel: 'Open Reddit'
    },
    linkedin: {
      icon: 'fab fa-linkedin',
      iconColor: 'text-blue-700',
      buttonColor: '#0077B5',
      buttonLabel: 'Open LinkedIn'
    },
    whatsapp: {
      icon: 'fab fa-whatsapp',
      iconColor: 'text-green-500',
      buttonColor: '#25D366',
      buttonLabel: 'Open WhatsApp'
    }
  }

  return platforms[platform.toLowerCase()] || {
    icon: 'fas fa-link',
    iconColor: 'text-gray-600',
    buttonColor: '#6B7280',
    buttonLabel: 'Open Link'
  }
}
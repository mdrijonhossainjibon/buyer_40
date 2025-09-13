# Earn From Ads BD

A Next.js application for earning money by watching ads and completing tasks, built specifically for Telegram Mini Apps.

## Features

- 🎯 Watch ads to earn money
- 📱 Telegram Mini App integration
- 👥 Referral system
- 💰 Withdrawal system
- 📺 YouTube and Telegram channel tasks
- 🌙 Dark/Light theme support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Nunito)

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── Header.tsx
    ├── LoadingOverlay.tsx
    ├── Navigation.tsx
    └── pages/
        ├── HomePage.tsx
        ├── SupportPage.tsx
        ├── TasksPage.tsx
        └── WithdrawPage.tsx
```

## Telegram Mini App Integration

This app is designed to work as a Telegram Mini App. Make sure to:

1. Set up your bot with BotFather
2. Configure the Mini App URL
3. Test within Telegram environment

## License

MIT License

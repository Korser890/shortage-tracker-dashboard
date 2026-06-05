# shortage-tracker-dashboard

Next.js dashboard that visualises global energy commodity shortage signals. Displays real-time flag status, price trends, inventory levels, production data, and a sentiment-scored news feed for crude oil and natural gas markets.

## Stack

- Next.js 15 · React 19 · TypeScript · Tailwind CSS · Recharts

## Prerequisites

<<<<<<< HEAD
The FastAPI backend must be running before starting the frontend. See the [backend repo](<https://github.com/Korser890/shortage-tracker-api>) for setup instructions.
=======
The FastAPI backend must be running before starting the frontend. See the [backend repo](https://github.com/Korser890/shortage-tracker-api) for setup instructions.
>>>>>>> 31ded2201938beeb8c0e15163a5f283ab4e74d18

## Setup

**1. Clone and install dependencies**

git clone <repo-url>
cd commodity-tracker
npm install



**2. Configure environment variables**

cp .env.example .env.local
Set `NEXT_PUBLIC_API_URL` to your backend URL (default: `http://localhost:8000`).

## Running the development server
npm run dev
Opens at `http://localhost:3000`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Overview dashboard — all commodities, supply balance, news feed |
| `/commodity/[slug]` | Detail page — price trend, inventory tank, production chart, comparisons |

## Commodities tracked

| Slug | Commodity |
|------|-----------|
| `brent-crude` | Brent Crude Oil |
| `wti-crude` | WTI Crude Oil |
| `henry-hub` | Henry Hub Natural Gas |
| `eu-ttf` | EU Natural Gas (TTF) |

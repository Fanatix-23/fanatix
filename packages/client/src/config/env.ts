// Native
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api'

// Huddle01
export const HUDDLE01_API_KEY: string = process.env.NEXT_PUBLIC_HUDDLE01_API_KEY ?? ""
export const HUDDLE01_PROJECT_ID: string = process.env.NEXT_PUBLIC_HUDDLE01_PROJECT_ID ?? ""

// SAFE

import { polygonMumbai } from "viem/chains"

export const CHAIN_ID = polygonMumbai.id.toString()
export const CHAIN_NAME = polygonMumbai.name
export const VIEM_CHAIN = polygonMumbai
export const BLOCK_EXPLORER_URL = "https://mumbai.polygonscan.com/"
export const RPC_URL = "https://polygon-mumbai.g.alchemy.com/v2/demo"


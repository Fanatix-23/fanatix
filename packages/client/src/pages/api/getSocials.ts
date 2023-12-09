import { init, fetchQuery } from "@airstack/node"

export default async function handler(req: any, res: any) {
  init(process.env.AIRSTACK_API_KEY || "")
  if (req.method === "POST") {
    const { data } = req.body

    try {
      const query = `
        query MyQuery($wallet_address: Identity!) {
            Wallet(input: {blockchain: ethereum, identity: $wallet_address}) {
                socials(input: {filter: {dappName: {_in: [lens]}}}) {
                    dappName
                    profileName
                }
            }
        }
      `
      const response = await fetchQuery(query, { wallet_address: data.user.walletAddress })
      res.status(201).json({ message: "Data fetched successfully!", data: response.data })
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed!" })
  }
}

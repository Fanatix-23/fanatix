import type { NextApiRequest, NextApiResponse } from "next"

const handler = (req: NextApiRequest, res: NextApiResponse<APITypes>) => {
  res.status(200).send({
    message: "Connection Successful",
    error: null,
    data: null,
  })
}

export default handler

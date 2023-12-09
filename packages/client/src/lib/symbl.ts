import { SYMBL_APP_ID, SYMBL_APP_SECRET } from "@/config/env"
import { Symbl } from "@symblai/symbl-web-sdk"

const symbl = new Symbl({
  appId: SYMBL_APP_ID,
  appSecret: SYMBL_APP_SECRET,
})

export default symbl

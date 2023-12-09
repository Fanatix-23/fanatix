const express = require("express")
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg")
const cors = require("cors")

const app = express()
const upload = multer()

app.use(
  cors({
    origin: "*",
    methods: "*",
  })
)

app.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send("No audio file received")
  }

  console.log("BUFFER: ", req.file.buffer)

  // Use ffmpeg to convert the received audio (webm) buffer to mp3 buffer
  const mp3Buffer = await convertToMP3(req.file.buffer)
  console.log("MP3 BUFFER: ", mp3Buffer)

  // Send the MP3 buffer to Symbl.ai for processing
  const symblaiParams = {
    name: "77714b464766703368457a513153614573464d7a573357487a64327971787262", // Replace with actual parameters
  }
  const accessToken =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjQ3NDI0NjMzMzA0NTE0NTYiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoid3FLRkdmcDNoRXpRMVNhRXNGTXpXM1dIemQyeXF4cmJAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzAyMTE5MTc2LCJleHAiOjE3MDIyMDU1NzYsImF6cCI6IndxS0ZHZnAzaEV6UTFTYUVzRk16VzNXSHpkMnlxeHJiIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.l1l7JoYEtyGM-Vn5EVyz0KdTpvON19Udo4m9_GlqfNVaK2A0-IGQguWC-_hKL1P39_izPABrI-nt-cMKbUAH85fOaeucZGV5EBGBzL5CCZqTAx1QIcRX2ZKdOD-PslsPlBdgx5ZGNwTe5XzDdaaT_5GiOWhbqZOha_eDrXtK9hndAHymv2m2bKQngByN6koL4se6zsFPyK4RAwS-xX9PF1w39WIlIUzOxAN7rvDEO-uB20NvowjB2XH2nDO2z1CMZwsHuThjXYFqImh2atTSMfysYj7t97_DWMJ_8j9gG6NN8SaWsIqRMtOkiMALSUKcSSutGhvR1f7bRkER_Fdf9Q" // Replace with your Symbl.ai access token

  const fetchResponse = await fetch(
    `https://api.symbl.ai/v1/process/audio?${new URLSearchParams(symblaiParams)}`,
    {
      method: "post",
      body: mp3Buffer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "audio/mp3", // Change content type as needed by Symbl.ai
      },
    }
  )

  const responseBody = await fetchResponse.json()
  res.send(responseBody) // Sending back the response from Symbl.ai to the client
})

// Function to convert the received webm buffer to mp3 buffer using FFmpeg
const convertToMP3 = (webmBuffer) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(webmBuffer)
      .inputFormat("webm")
      .toFormat("mp3")
      .audioCodec("libmp3lame")
      .on("end", () => {
        const mp3Buffer = fs.readFileSync("output.mp3")
        // Optionally, delete the generated mp3 file after processing
        fs.unlinkSync("output.mp3")
        resolve(mp3Buffer)
      })
      .save("output.mp3")
  })
}

app.listen(5001, () => {
  console.log("Server is running on port 5001")
})

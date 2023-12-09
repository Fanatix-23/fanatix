import { MongoClient } from "mongodb"

export default async function handler(req: any, res: any) {
  const client = new MongoClient(process.env.MONGODB_URI || "", {})

  try {
    await client.connect()
    const database = client.db("fanatix-userdb") // Choose a name for your database

    const collection = database.collection("main-collection") // Choose a name for your collection

    const value = await collection.find({
      isCreator: "true"
    }).toArray()

    res.status(201).json({ message: "Data fetched successfully!", value: value })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" })
  } finally {
    await client.close()
  }
}

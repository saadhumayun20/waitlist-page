import { Db } from "mongodb";

export interface WaitlistData {
  email: string;
  createdAt: Date;
}

export async function createWaitlistEntry(
  db: Db,
  waitlistData: WaitlistData
): Promise<string> {
  const collection = db.collection("waitlist");

  try {
    const existingEntry = await collection.findOne({ email: waitlistData.email });
    if (existingEntry) {
      throw new Error("Email is already on the waitlist");
    }

    const result = await collection.insertOne(waitlistData);
    return result.insertedId.toString();
  } catch (error) {
    console.error("Failed to create waitlist entry:", error);
    throw error;
  }
}

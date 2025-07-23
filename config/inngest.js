import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create Inngest client
export const inngest = new Inngest({ id: "MeroCart-next" });

/**
 * Clerk: USER CREATED
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUri: image_url,
    };

    await connectDB();
    await User.create(userData);
    console.log("✅ User created:", userData);
  }
);

/**
 * Clerk: USER UPDATED
 */
export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedUserData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageUri: image_url,
    };

    await connectDB();
    const result = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
      upsert: true, // create if not exists
    });

    console.log("✅ User updated:", result);
  }
);

/**
 * Clerk: USER DELETED
 */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      console.log("Received deletion event data:", event.data);
      const { id } = event.data;
      console.log("Deleting user with id:", id);

      await connectDB();
      const deletedUser = await User.findByIdAndDelete(id);

      if (deletedUser) {
        console.log("🗑️ User deleted:", id);
      } else {
        console.log("User not found with id:", id);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
);

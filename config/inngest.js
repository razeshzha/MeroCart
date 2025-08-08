import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "merocart-next" });

// ------------------- CREATE USER -------------------
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id, // Clerk's user ID as _id
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUri: image_url,
      };

      await connectDB();
      const newUser = await User.create(userData);

      console.log("✅ User created:", newUser);
    } catch (error) {
      console.error("❌ Error creating user:", error);
    }
  }
);

// ------------------- UPDATE USER -------------------
export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUri: image_url,
      };

      await connectDB();
      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

      console.log("✅ User updated:", updatedUser);
    } catch (error) {
      console.error("❌ Error updating user:", error);
    }
  }
);

// ------------------- DELETE USER -------------------
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { id } = event.data;

      await connectDB();
      await User.findByIdAndDelete(id);

      console.log("✅ User deleted:", id);
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    }
  }
);

import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "merocart-next" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Example: Extract data from event
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUri: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);
// Inngest function to update user data in the database
export const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUri: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);

    console.log("✅ User updated:", updatedUser);
  }
);

//Inngest  function to delete  user from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

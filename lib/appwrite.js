import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

import {
  ENDPOINT,
  PLATFORM,
  PROJECT_ID,
  DATABASE_ID,
  USER_COLLECTION_ID,
  DAILY_ENTRIES_COLLECTION_ID,
  STORAGE_ID,
} from "@env";

export const config = {
  endpoint: ENDPOINT,
  platform: PLATFORM,
  projectId: PROJECT_ID,
  databaseId: DATABASE_ID,
  userCollectionId: USER_COLLECTION_ID,
  dailyEntriesCollectionId: DAILY_ENTRIES_COLLECTION_ID,
  storageId: STORAGE_ID,
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, username, userInfo) {
  try {
    // Create a new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);

    // Ensure there is no active session
    await clearSessions();

    // Sign in the user
    await signIn2(email, password);

    // Create user document in the database
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        ...userInfo,
      }
    );
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
}

export async function signIn2(email, password) {
  try {
    // Create a new session
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    if (
      error.message ===
      "AppwriteException: Creation of a session is prohibited when a session is active."
    ) {
      console.log("A session is already active.");
      return account.getSession("current");
    }
    console.error("Error during sign in:", error);
    throw new Error(error.message);
  }
}

export async function signIn(email, password) {
  try {
    // Check if a user is already logged in
    const currentUser = await getCurrentUser();
    console.log("Current user:", currentUser);

    // If a user is logged in, log out the user
    if (currentUser) {
      await deleteCurrentSession();
    }
    // Create a new session
    const session = await account.createEmailPasswordSession(email, password);
    console.log("New session:", session);

    // Check if the session is correctly established
    if (!session || !session.$id) {
      throw new Error("Failed to establish session");
    }

    // Retry getting the current user with a delay
    let newUser = null;
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 1-second delay
      newUser = await getCurrentUser();
      if (newUser) break;
    }

    if (!newUser) {
      throw new Error("Failed to retrieve current user");
    }

    console.log("New user:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw new Error(error.message);
  }
}

export async function clearSessions() {
  try {
    const sessions = await account.listSessions();
    for (const session of sessions.sessions) {
      await account.deleteSession(session.$id);
    }
    console.log("All sessions cleared.");
  } catch (error) {
    console.error("Error clearing sessions:", error);
  }
}

export async function transferUserDataToDailyEntries() {
  try {
    // Get all users
    const users = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId
    );

    console.log("Total users:", users.documents.length); // Log total number of users

    for (const user of users.documents) {
      console.log("User document:", user); // Log the user document

      console.log("Processing user:", user.$id); // Log user ID

      // Prepare daily entry data
      const dailyEntryData = {
        user: user.$id, // Set the "user" attribute with the user's ID
        date: new Date().toISOString().split("T")[0], // Current date
        calories: user.calories,
        protein: user.protein,
        fat: user.fat,
        carbs: user.carbs,
        water: user.water,
        weight: user.weight,
        unit: user.unit,
      };

      console.log("Daily entry data:", dailyEntryData); // Log daily entry data

      // Create a new daily entry
      await databases.createDocument(
        config.databaseId,
        config.dailyEntriesCollectionId,
        ID.unique(),
        dailyEntryData
      );

      console.log("Daily entry created successfully for user", user.$id);
    }

    console.log("Data transfer completed successfully."); // Log success message
  } catch (error) {
    console.error("Error transferring user data to daily entries:", error); // Log error message
    throw error; // Re-throw the error for handling in the caller
  }
}

// Delete current session
export async function deleteCurrentSession() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount || !currentAccount.$id) {
      throw new Error("No current account");
    }
    return currentAccount;
  } catch (error) {
    console.error("Error getting account:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    console.log("Current user documents:", currentUser.documents); // Log the user documents

    if (
      !currentUser ||
      !currentUser.documents ||
      currentUser.documents.length === 0
    ) {
      throw new Error("No current user");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function updateUser(accountId, userInfo) {
  try {
    const updatedUser = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      accountId,
      userInfo
    );
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
export async function authenticatedOperation(email, password) {
  try {
    // Sign in the user
    await signIn(email, password);

    // Perform the operation
    const currentUser = await getCurrentUser();
    console.log(currentUser);
  } catch (error) {
    console.error(error);
  }
}

export async function getDocument(databaseId, collectionId, documentId) {
  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
    return document;
  } catch (error) {
    console.error(`databases.getDocument threw an error: ${error}`);
    throw new Error(error);
  }
}

export async function checkSession() {
  try {
    const currentUser = await getCurrentUser();

    // If a user is returned, a session is active
    if (currentUser && currentUser.length > 0) {
      return true;
    }
  } catch (error) {
    console.error(`Error getting current user: ${error}`);
  }

  // If no user is returned or an error occurs, no session is active
  return false;
}

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.dmitr.nutriflex",
  projectId: "6639e5ff00148b82ed00",
  databaseId: "6639e702003a973458ad",
  userCollectionId: "6639e71800274276a0d9",
  storageId: "6639eb6d00009668b980",
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
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    // Delete the current session before signing in
    await deleteCurrentSession();

    await signIn(email, password);

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
    console.error(error);
    throw new Error(error);
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
// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
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

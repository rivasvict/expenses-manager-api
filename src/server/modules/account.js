const create = async ({ account, user }) => {
  try {
    if (!account && !user) {
      return new Error('ValidationErroro: account and user instances are required');
    }

    const savedAccount = await getUserSavedAccount({ account, user });

    return savedAccount;
  } catch (error) {
    throw error;
  }
};

const getUserSavedAccount = async ({ account, user }) => {
  try {
    const savedAccount = await account.create();
    await user.updateOne({
      accounts: [savedAccount._id]
    });

    return savedAccount;
  } catch (error) {
    throw error;
  }
};

module.exports = { create };

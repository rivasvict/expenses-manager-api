const create = async ({ account, user }) => {
  try {
    if (!account && !user) {
      return new Error('ValidationError: account and user instances are required');
    }

    const savedAccount = await createAccountRelatedToUser({ account, user });

    return savedAccount;
  } catch (error) {
    throw error;
  }
};

const createAccountRelatedToUser = async ({ account, user }) => {
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

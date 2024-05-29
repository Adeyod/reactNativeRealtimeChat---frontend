// const host = 'http://192.168.178.234:4000/api/users';
const host = 'http://192.168.43.47:4000/api/users';
const messageHost = 'http://192.168.43.47:4000/api/messages';

const registerRoute = `${host}/register`;
const emailVerificationRoute = `${host}/verify-user`;
const loginRoute = `${host}/login`;
const getAllUserExceptLoggedInUserRoute = `${host}/getAllUserExceptLoggedInUser`;
const getRecipientDataRoute = `${host}/get-recipient`;
const sendFriendRequest = `${host}/friend-request`;
const getFriendRequestsRoute = `${host}/show-friend-request`;
const deleteFriendRequestRoute = `${host}/delete-friend-request`;
const fetchFriendsRoute = `${host}/friends`;
const postImageMessageRoute = `${messageHost}/post/image`;
const postTextMessageRoute = `${messageHost}/post-text`;
const fetchMessagesBetweenUsersRoute = `${messageHost}/get-messages`;
const deleteMessagesRoute = `${messageHost}/delete-messages`;
const sentFriendRequestRoute = `${host}/friend-request/sent`;
const getUserFriends = `${host}/get-friendIds`;
const logoutRoute = `${host}/logout`;
const forgotPasswordRoute = `${host}/forgot-password`;
const resetPasswordDetailsRoute = `${host}/reset-password`;

export {
  forgotPasswordRoute,
  resetPasswordDetailsRoute,
  logoutRoute,
  getUserFriends,
  sentFriendRequestRoute,
  deleteMessagesRoute,
  fetchMessagesBetweenUsersRoute,
  getRecipientDataRoute,
  postImageMessageRoute,
  postTextMessageRoute,
  deleteFriendRequestRoute,
  getAllUserExceptLoggedInUserRoute,
  registerRoute,
  emailVerificationRoute,
  loginRoute,
  sendFriendRequest,
  getFriendRequestsRoute,
  fetchFriendsRoute,
};

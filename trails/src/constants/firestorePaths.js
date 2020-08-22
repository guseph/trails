export const USERS_COL_PATH = 'users'
export const USER_DOC_PATH = userId => `${USERS_COL_PATH}/${userId}`

export const USER_RECEIPTS_GROUP_NAME = 'userReceipts'
export const USER_RECEIPTS_COL_PATH = userId => `${USER_DOC_PATH(userId)}/${USER_RECEIPTS_GROUP_NAME}`
export const USER_RECEIPT_DOC_PATH = (userId, receiptId) => `${USER_RECEIPTS_COL_PATH(userId)}/${receiptId}`
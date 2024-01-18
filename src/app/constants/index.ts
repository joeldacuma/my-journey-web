// AUTH CONSTANTS
export const MY_JOURNEY_AUTH_CONSTANT = 'my-journey-auth';
export const JWT_ACCESS_CONSTANT = 'access_token';
export const JWT_REFRESH_TOKEN_CONSTANT = 'refresh_token';

// SCREEN SIZES
export const TABLET_SIZE_WIDTH = 991;

// API QUERIES
export const POPULATE_ALL = 'populate=deep&_limit=-1';

// MESSAGES
export const ERROR_MESSAGE_LOGIN_FAILED_TITLE = 'Error Logging In';
export const ERROR_MESSAGE_LOGIN_EMPTY_FIELDS = 'Invalid credentials.';
export const SUCCESS_MESSAGE_LOGIN_TITLE = 'Login Successful';
export const SUCCESS_MESSAGE_LOGIN_DETAILS = 'Redirecting to home...';
export const DELETE_EVENT_SUCCESS_TITLE = 'Event Deleted';
export const DELETE_EVENT_SUCESS_DETAILS = 'Selected events had been removed.';
export const DELETE_MEMBER_SUCCESS_TITLE = 'Member Deleted';
export const DELETE_MEMBER_SUCESS_DETAILS = 'Selected members had been removed.';
export const ERROR_CREATE_EVENT_TITLE = 'Error Creating Event';
export const ERROR_CREATE_EVENT_DETAILS = 'Please check your inputs.';
export const SUCCESS_CREATE_EVENT_TITLE = 'Event Created';
export const SUCCESS_CREATE_EVENT_DETAILS = 'Event had been created.';
export const ERROR_CREATE_GUEST_TITLE = 'Error Creating Guest';
export const ERROR_CREATE_GUEST_DETAILS = 'Please check your inputs fields.';
export const ERROR_CREATE_MEMBER_TITLE = 'Error Creating Member';
export const ERROR_CREATE_MEMBER_DETAILS = 'Please check your inputs fields.';
export const ERROR_CREATE_MEMBER_DUPLICATE = 'Member email already exists.';
export const SUCCESS_CREATE_MEMBER_TITLE = 'New Member Registered';
export const SUCCESS_CREATE_MEMBER_DETAILS = 'Member had been created.';
export const SUCCESS_CREATE_GUEST_TITLE = 'New Guest Registered';
export const SUCCESS_CREATE_GUEST_DETAILS = 'Guest had been created.';
export const ERROR_GENERIC_TITLE = 'Error on Request';
export const ERROR_GENERIC_DETAILS = 'Please contact the administrator.';
export const ERROR_UPDATE_EVENT_TITLE = 'Error Updating Event';
export const ERROR_UPDATE_EVENT_DETAILS = 'Please check your inputs.';
export const SUCCESS_UPDATE_EVENT_TITLE = 'Event Updated';
export const SUCCESS_UPDATE_EVENT_DETAILS = 'Event had been updated.';
export const ERROR_EXPIRED_SESSION_TITLE = 'Session Expired';
export const ERROR_EXPIRED_SESSION_DETAILS = 'Please login again.';
export const CONFIRM_DELETE_EVENT_TITLE = 'Delete Event';
export const CONFIRM_DELETE_EVENT_DETAILS = 'Are you sure you want to delete the selected event(s)?';
export const CONFIRM_DELETE_MEMBER_TITLE = 'Delete Member';
export const CONFIRM_DELETE_MEMBER_DETAILS = 'Are you sure you want to delete the selected member(s)?';
export const ERROR_UPDATE_MEMBER_TITLE = 'Error Updating Member';
export const ERROR_UPDATE_MEMBER_DETAILS = 'Please check your inputs.';
export const SUCCESS_UPDATE_MEMBER_TITLE = 'Member Updated';
export const SUCCESS_UPDATE_MEMBER_DETAILS = 'Member had been updated.';

// ROUTES
export const API_AUTH_URL = 'authentication/signin';
export const ROUTE_DASHBOARD = '/';
export const ROUTE_LOGIN = '/login';

// SELECTION
export const GENDER_SELECTION = [
 {
    id: 3,
    label: 'Male'
 },
 {
    id: 4,
    label: 'Female'
 }
];

export const ACTIVE_SELECTION = [
   {
      id: 1,
      label: 'Yes'
   },
   {
      id: 2,
      label: 'No'
   }
];

// FILE TYPES
export const FILE_DOWNLOAD_ATTENDANCE_NAME = 'attendance';
export const FILE_DOWNLOAD_GUEST_ATTENDANCE_NAME = 'guests';
export const FILE_TYPE_CSV = 'text/csv';
export const FILE_DOWNLOAD_ATTENDANCE_CONFIRM_SUCCESS_TITLE = 'Download Attendance Success';
export const FILE_DOWNLOAD_ATTENDANCE_CONFIRM_SUCCESS_DETAILS = 'Attendance file had been downloaded.';
export const FILE_DOWNLOAD_ATTENDANCE_CONFIRM_ERROR_TITLE = 'Download Attendance Error';
export const FILE_DOWNLOAD_ATTENDANCE_CONFIRM_ERROR_DETAILS = 'Please contact the administrator.';

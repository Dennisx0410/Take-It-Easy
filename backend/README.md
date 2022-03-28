# Backend
---
## Sign up 
### URL: 
```
POST /signup
```
### Header
- `Content-type: application/json`
### Body
- `username`: String (unique)
- `password`: String
- `email`: String
- `phoneNum`: String (optional)
- `profile`: File(jpg/png) (optional)
### Return(json)
- `UserAlreadyExisted`
- `OtpNotFound`
- `PendingOtp`
- `VerificationEmailSent`

## Reverify
### URL
```
/reverify
```
### Header
- `Content-type: application/json`
### Body
- `username`: String (unique)
- `email`: String
### Return(json)
- `OtpNotFound`
- `PendingOtp`
- `VerificationEmailSent`

## Verify/Activate
### URL
```
/activate
```
### Header
- `Content-type: application/json`
### Body
- `username`: String (unique)
- `otp`: Integer (6 digit)
### Return(json)
- `token`
- `OtpNotFound`
- `OtpExpired`
- `TooMuchTrials`
- `InvalidOtp`
- `PendingOtp`
- `VerificationEmailSent`

## Signin
### URL
```
/signin
```
### Header
- `Content-type: application/json`
### Body
- `username`: String (unique)
- `password`: String
### Return(json)
- `token`
- `AccountNotActivated`
- `UserNotFound`
- `InvalidPassword`

## Update Account Info 
**Not implement yet**
### URL
```
/update
```
### Header
- `Content-type: application/json`
### Body
<!-- - `username`: String (unique)
- `password`: String -->
### Return(json)

## Logout
### URL
```
/logout
```
### Header
- `Authorization: Bearer <token>`
### Body
- N/A
### Return(json)
- `VerifyError`
- `InactiveUserRequest`
- `SuccessfullyLogout`

## Set Profile Picture
### URL
```
/setProfilePic
```
### Header
- `Authorization: Bearer <token>`
### Body
- `profile`: File (jpg/png)
### Return(json)
- File info
- `VerifyError`
- `InactiveUserRequest`
- `FileExtensionError`

## Get Profile Picture
### URL
```
/getProfilePic
```
### Header
- `Authorization: Bearer <token>`
### Body
- N\A
### Return(json)
- File
- `VerifyError`
- `InactiveUserRequest`
# Backend
---
## Sign up 
#### URL: 
```
POST /customer/signup
```
#### Header
- `Content-type: application/json`
#### Body
- `username`: String (unique)
- `password`: String
- `email`: String
- `phoneNum`: String (optional)
- `profile`: File(jpg/png) (optional)
#### Return(json)
- `UserAlreadyExisted`
- `OtpNotFound`
- `PendingOtp`
- `VerificationEmailSent`

## Reverify
#### URL
```
POST /customer/reverify
```
#### Header
- `Content-type: application/json`
#### Body
- `username`: String (unique)
- `email`: String
#### Return(json)
- `OtpNotFound`
- `PendingOtp`
- `VerificationEmailSent`

## Verify/Activate
#### URL
```
POST /customer/activate
```
#### Header
- `Content-type: application/json`
#### Body
- `username`: String (unique)
- `otp`: Integer (6 digit)
#### Return(json)
- `token`
- `OtpNotFound`
- `OtpExpired`
- `TooMuchTrials`
- `InvalidOtp`
- `PendingOtp`
- `VerificationEmailSent`

## Signin
#### URL
```
POST /customer/signin
```
#### Header
- `Content-type: application/json`
#### Body
- `username`: String (unique)
- `password`: String
#### Return(json)
- `token`
- `AccountNotActivated`
- `UserNotFound`
- `InvalidPassword`

## Update Account Info 
**Not implement yet**
#### URL
```
POST /customer/update
```
#### Header
- `Content-type: application/json`
#### Body
<!-- - `username`: String (unique)
- `password`: String -->
#### Return(json)

## Logout
#### URL
```
POST /customer/logout
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return(json)
- `VerifyError`
- `InactiveUserRequest`
- `SuccessfullyLogout`

## Set Profile Picture
#### URL
```
POST /customer/setProfilePic
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- `profile`: File (jpg/png)
#### Return(json)
- File info
- `VerifyError`
- `InactiveUserRequest`
- `FileExtensionError`

## Get Profile Picture
#### URL
```
POST /customer/getProfilePic
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return(json)
- File
- `VerifyError`
- `InactiveUserRequest`
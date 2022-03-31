# Backend
To start server **with** auto update
```
npm start
```
To start server without auto update
```
node ./index.js
```

server port: `5000`

# Documentation List
[-Customer](#documentation-customer)

[-Admin](#documentation-admin)

[-Restaurant](#documentation-restaurant)

# Documentation (Customer)
[Return to top](#backend)
## Sign up 
#### URL: 
```
POST /customer/signup
```
#### Header
- N/A
#### Body
- `username`: String (unique)
- `password`: String
- `email`: String
- `phoneNum`: String
- `profile`: File (jpg/jpeg/jfif/png)
#### Return(json)
- `UserAlreadyExisted`
- `FileExtensionError`
- `VerificationEmailSent`

## Activate
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
update /customer/data
```
#### Header
- `Content-type: application/json`
#### Body
- **not decided yet**
#### Return(json)
- **not decided yet**

## Get customer data
#### URL
```
GET /customer/data
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return(json)
- json of username, phoneNum, email, points, profilePic

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
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `SuccessfullyLogout`

## Set Profile Picture
#### URL
```
POST /customer/profilePic
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- `profile`: File (jpg/jpeg/jfif/png)
#### Return(json)
- `ChangedProfilePic`
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `FileExtensionError`

## Get Profile Picture
#### URL
```
GET /customer/profilePic
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return(json)
- File buffer
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`

## Other requests
#### Return(json) 
- `Forbidden`

# Documentation (Admin) 
[Return to top](#backend)
## Signin
#### URL
```
POST /admin/signin
```
#### Header
- `Content-type: application/json`
#### Body
- `username`: String (unique)
- `password`: String
#### Return(json)
- `token`
- `UserNotFound`

## Get customer data 
```
GET /admin/customers
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return(json)
- array of customer data 

# Documentation (Restaurant)
[Return to top](#backend)
## Sign Up A Restaurant Account
#### URL
```
POST /restaurant/signup
```
#### Header
- `Content-type: application/json`
#### Body
- `username` : String (Unique),
- `restaurantName` : String,
- `password` : String,
- `address` : String,
- `licenseNum` : String
#### Return
- `Done creating new restaurant`
- `User with same username already registed`

## Activate Restaurant Account
#### URL
```
POST /restaurant/activate
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- `Account already activated`
- `Account activated`

## Sign in Restaurant Account
#### URL
```
POST /restaurant/signin
```
#### Header
- `Content-type: application/json`
#### Body
- `username` : String,
- `password` : String
#### Return
- `token`
- `AccountNotActivated`
- `UserNotFound`
- `InvalidPassword`
- `Account not activated`

## Get A Restaurant Info
#### URL
```
POST /restaurant/getinfo
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- Restaurant Json document

## Get All Activated Restaurant Info
#### URL
```
GET /restaurant/getAll
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- Array of activated restaurant JSON documents

## Get All Not Activated Restaurant Info
#### URL
```
GET /restaurant/getNotActive
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- Array of not activated restaurant Json documents

## Logout
#### URL
```
POST /restaurant/logout
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- `SuccessfullyLogout`

## Set Profile Picture
#### URL
```
POST /restaurant/profilePic
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- `profile` : File (jpg/jpeg/jfif/png)
#### Return
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`
- `FileExtensionError`

## Get Profile Picture
#### URL
```
GET /restaurant/profilePic
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- File buffer
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InactiveUserRequest`



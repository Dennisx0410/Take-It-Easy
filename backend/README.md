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

[-Order](#documentation-order)

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
- `SignupSuccessAndVerificationEmailSent`

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
- `AlreadyActivated`
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
- `AccountNotActivatedAndPendingOtp`
- `AccountNotActivatedAndVerificationEmailSent`
- `UserNotFound`
- `InvalidPassword`

## Change password
#### URL
```
update /customer/password
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- `passwordOld`
- `passwordNew`
#### Return(json)
- `VerifyError`
- `JsonWebTokenError`
- `TokenExpiredError`
- `InvalidPassword`
- `SuccessfullyChangedPassword`

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
- `email` : String, 
- `address` : String,
- `licenseNum` : String,
- `profile`: File (jpg/jpeg/jfif/png)
#### Return
- `UserAlreadyExisted`
- `FileExtensionError`
- `RegisterationReceived`

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
- `AccountNotApproved`
- `UserNotFound`
- `InvalidPassword`

## Get A Restaurant Info
#### URL
```
GET /restaurant/data
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- Restaurant Json document

## Get All Approved Restaurant Info
#### URL
```
GET /restaurant/all
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
- Array of activated restaurant JSON documents

## Get All Not Approved Restaurant Info
#### URL
```
GET /restaurant/notApproved
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

# Documentation (Order)
[Return to top](#backend)

## Fetch Order from the respective restaurant
#### URL
```
/order/fetchByRestaurant
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
-`List of orders, for which items is aggregate with food item to provide more detail`

## Fetch order from the respective customer
#### URL
```
/order/fetchByCustomer
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- N/A
#### Return
-`List of orders, for which items is aggregate with food item to provide more detail`

## Create new order
#### URL
```
/order/add
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- restaurantID : String
- items : Array of String
#### Return
-`The order document`

## Finished an Order
#### URL
```
/order/done
```
#### Header
- `Authorization: Bearer <token>`
#### Body
- orderId : String
#### Return
`Order Status Updated`

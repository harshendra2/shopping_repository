                   API  Specification Doc
1. User Signup:
User signs up with an email, password, full name, and mobile number.
         Method: POST
               URL: "/user/register"

               
            Request:
             Parameters:
            email: User's email address
            password: User's password (at least 6 characters long)
            fname: User's full name (at least 5 characters long)
            mobile: User's mobile number
            
       Response:
         Status: 400
           Message: "Invalid email address"
           Message: "Invalid character in email"
           Message: "Password must be at least 6 characters long"
           Message: "Invalid character in password"
           Message: "Mobile number must be numeric"
           Message: "Name must be at least 5 characters"
           Message: "This user already exists in our database"
      Status: 500
          Message: "Internal Server Error"
      Status: 200
          Message: "Please check your Email"

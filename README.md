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

2. User Signup OTP Verification:
        User verifies email OTP for signup.

           Method: POST
           URL: "/user/registerotp"

                 Request:
                  Parameters:
                    otp: OTP received via email for verification
   
              Response:
                 Status: 200
                    Message: "User registered successfully"
                 Status: 400
                    Message: "Invalid OTP"

4. User Login :
      User Login with an password and email
   
          Method: POST
          URL: "/user/login"

   
             Request:
             Parameters:
              email: User's email address
              password: User's password (at least 6 characters long)

   
            Response:
                Status: 200
                     Message: "User Login successfully"
                      Returns : “userToken”(String): Token for Authentication
                Status: 400
                     Message: "Invalid email address"
                     Message: "Invalid character in email"
                     Message: "Password must be at least 6 characters long"
                     Message: "Invalid character in password"
                     Message:”This user does not exist our database”
                     Message:”Please Enter correct password”

   4  Add Products

             User can add new Products

   
                     Method: POST
                          URL: "/user/additem"

   
         Request:
         Parameters:
            title (string, required): The name of the product (at least 5 characters long).
            description (string, required): Description of the product (at least 10 characters long).
         Headers:
            Authorization (string, required): User authentication token.


        Response:
           Status: 200
                 Message: "Product Added Successfully"
           Status: 400
                 Message: "Title must be at least 5 characters long"
                 Message: "Title can only contain letters"
                 Message: "Description must be at least 10 characters long"
                 Message: "Description is required"
          Status:500
                 Message: “Internal Server Error”

   
 5:   Get Products
        User can Get all products

        
           Method: GET
           URL: "/user/getproduct"
         Headers:
             Authorization (string, required): User authentication token.



        Response:
           Status: 200
             Returns : all products in JSON format
           Status:500
              Message: “Internal Server Error”


6: Get Single Product
    Get single product by using product ID 
              Explanation: This URL is used to retrieve a single product, and it’s also used for editing a product, populating the form with existing data.

              
        Method: GET
        URL: "/user/getproducts/:id"
        
        Headers:
        Authorization (string, required): User authentication token.



       Parameters:
         id: product ID
         Response:
           Status: 200
             Returns : all products in JSON format
           Status:500
              Message: “Internal Server Error”


7 : Delete a single product.
           Delete a single product by using product ID.

           
            Method: DELETE
            URL: "/user/deleteproduct/:id"
               Headers:
        Authorization (string, required): User authentication token.


        Parameters:
           id: product ID
       Response:
            Status: 200
               Returns : Product deleted Successfully.
            Status:500
              Message: “Internal Server Error”


 8 : Edit the Product.
      This URL are used to update title and description

      
              Method: PUT
              URL: "/user/editproduct"

              
                Request:
                Parameters:
                  title (string, required): The name of the product (at least 5 characters long).
                  description (string, required): Description of the product (at least 10 characters long).
               id:product ID
                Headers:
                 Authorization (string, required): User authentication token.


              Response:
               Status: 200
                Message: "Product Updated Successfully"
               Status: 400
                Message: "Title must be at least 5 characters long"
                Message: "Title can only contain letters"
                Message: "Description must be at least 10 characters long"
                Message: "Description is required"
                Message: "Product Not found"
                Message: "No change were made"
            Status:500
                Message: “Internal Server Error”

                

9 : Edit the Product Status .
                 This URL are used to Change the Status of product . Initially this product Status is “processing ”

                 
                    Method: PUT
                    URL: "/user/statusupdate"
              Request:
              Parameters:
               id:product ID
           Headers:
               Authorization (string, required): User authentication token.

           Response:
             Status: 200
               Message: "Status Updated Successfully"
             Status: 404
               Message: "Please provide Product ID"
               Message: "Product not found"
             Status:500
               Message: “Internal Server Error”





ENV Files

DATABASE=””
SECRET_KEY=””    :secret key for JWT verification
EMAILUSER=””       :nodemailer user name
EMAILPASSWORD=””   :nodemailer password

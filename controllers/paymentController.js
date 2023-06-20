import { instance } from "../server.js"
import crypto from "crypto"
import { Payment } from "../models/paymentModel.js";


export const checkout = async (req,res) => {


    //this is used to create a orderid
    var options = {
        amount: Number(req.body.amount*100),  // amount in the smallest currency unit
        currency: "INR",
      };
      const order = await instance.orders.create(options);
       
      console.log(order)
      res.status(200).json({
        success:true,
        order
      })
}

export const paymentVerification = async (req,res) => {
    
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
  
   const body=razorpay_order_id+ "|" +razorpay_payment_id ;
  console.log(req.body)
  const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET)
                             .update(body.toString())
                             .digest('hex')
                            //  console.log('sig recieve',razorpay_signature)
                            //  console.log("sig generate", expectedSignature)

           const isAuthentic = expectedSignature === razorpay_signature
           if(isAuthentic){
            //database comes here
         await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
         })
            res.redirect(
              `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
            )

           }else{
            res.status(400).json({
              success:false,
        
           })
    }
}
const crypto = require('crypto');
require('dotenv').config();
const secretKey = process.env.AES_SECRET_KEY;


const encrypt = (data) => {
  try{
    const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  catch(error){
    console.log(error);
  }
};


module.exports ={encrypt};
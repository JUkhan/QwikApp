const nodemailer = require('nodemailer');

const sendMail=async (data)=>{
    const test = await nodemailer.createTestAccount();
   
    const transporter = nodemailer.createTransport({
      host:test.smtp.host,
      port:test.smtp.port,
      secure:test.smtp.secure,
      //service: 'gmail',
      auth: {
        user: test.user,
        pass: test.pass
      }
    });
    
    const mailOptions = {
      from: 'abdur.rahman.bin.jasim@gmail.com',
      to: 'jasim.uddin.khan@gmail.com',
      subject: 'Sending Email using Node.js',
      //text: 'That was easy!',
      html:`<h1>Welcome!</h1><p>Awesome</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
};
sendMail({});

const nodemailer = require("nodemailer");

const express = require('express')
const router = express.Router()

const contactService = require('./service')

router.get('/', getContactInfo)

router.post('/', addContactInfo)
router.post('/message', sendMessage)
router.patch('/:uid', updateContactInfo)
router.delete('/:uid', deleteContactInfo)

module.exports = router

function getContactInfo(req, res, next)  {
    const { baseUrl, query: {name}} = req
    console.log(baseUrl)
    return contactService.getContactInfo(name)
        .then( contacts => res.json(contacts))
        .catch( err => next(err))
}

function deleteContactInfo({params: {uid}}, res, next)  {
    return contactService.delete(uid)
        .then( contact => res.json(contact))
        .catch( err => next(err))
}   

function updateContactInfo({params: {uid}, body}, res, next)  {
    return contactService.getByIdMongooseUse(uid)
        .then( contact => {
            doUpdate(contact, body)
            .then( updated => res.json(updated))
            .catch( err => next(err))
        })
        .catch( err => next(err))
}

function addContactInfo({body}, res, next){
    return contactService.createOne(body)
        .then( newCategory => res.json(newCategory) )
        .catch( err => next(err))
}

async function doUpdate(document, props){
    document.set(props)
    return await document.save()
}


function sendMessage({body}, res, next){
    return main(body)
        .then(result => res.json(result))
        .catch(console.error);
}

// async..await is not allowed in global scope, must use a wrapper
function main({fullName, email, subject, message}){
    return new Promise(async (resolve, reject) => {
        let account = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
              sendmail: true,
              newline: 'unix',
              path: '/usr/sbin/sendmail'
          });
          
        // setup email data with unicode symbols
        let mailOptions = {
          from: `"${fullName}: Contact Page" <${email}>`, // sender address
          to: "psemberekajr@gmail.com", // list of receivers
          subject, // Subject line
          text: message, // plain text body
          html: `<b>${message}</b>` // html body
        };
      
        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)
      
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        resolve({success: true})
    })
  
}


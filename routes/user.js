const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
const AWS = require('aws-sdk');
const multer = require('multer');
const up = multer();
const multerS3 = require('multer-s3');
var fs = require('fs');

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});


function randomid(length) {
    var str              = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       str += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return str;
 } 

router.get('/', async (req, res) => {
    const users =  await User.find()
    res.send({
        "count": users.length,
        "data": users
    })
})

router.get('/:id', async (req, res) => {
    let isValid = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!isValid) return res.status(404).send({success: false, data: "El usuario no existe"})
    const user = await  User.findById(req.params.id)
    if (!user) return res.status(404).send({success: false, data: "El usuario no existe"})
    res.send({
        "data": user    
    })
})

router.post('/', async (req, res) => {
    let user = await User.findOne({email: req.body.email})

    if (user) return res.status(400).send({success: false, data: "El email ya se encuentra en uso"})

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    var randomCode = randomid(55);

    user = new User({
        email: req.body.email,
        confirmationCode: randomCode,
        password: hashPassword
    })
    var readHTMLFile = (path, callback) => {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
          if (err) {
            throw err;
          }
          else {
            return callback(null, html);
          }
        });
      };
      
      let smtpTransportVar = nodemailer.createTransport(smtpTransport({
        host: process.env.EMAIL_HOST,
        secure: process.env.EMAIL_SECURE,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          authMethod:'NTLM',
            secure:false,
            tls: {rejectUnauthorized: false},
            debug:true
        }
      }));
      
      readHTMLFile(__dirname + '/template.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
          code: randomCode
        };
        var htmlToSend = template(replacements);
              var mailOptions = {
                  from: 'no-reply@ccmna.com.ec',
                  to : req.body.email,
                  subject : 'Confirmar Correo Electrónico',
                  html : htmlToSend
               };
              smtpTransportVar.sendMail(mailOptions, (error, response)=> {
                  if (error) {
                      console.log(error);
                      callback(error);
                  }
              });
          });

    const result = await user.save()
    res.status(201).send({
      success: true,
      data: "Usuario creado sastifactoriamente",
      email: result.email
    })
})

router.post('/code/', async (req, res) => {
  User.findOneAndUpdate({ confirmationCode: req.body.code }, { $set: {confirmationCode: null}}, function (err, user) {
    if (err) {
      console.error(err);
      res.send('Error');
    } else {
      if (user === null) {
        res.status(404).send({
          success: false,
          data: null
      })
      } else {
        res.status(201).send({
          success: true,
          data: "Correo confirmado sastifactoriamente"
      })
      }
    }
  });
});


router.post('/avatar/:id', (req, res) => {
  const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: 'ccnma',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (request, file, cb) {
          let extn = file.originalname.split('.').pop();
          let nameFile = Date.now().toString()+randomid(20)+'.'+extn.toLowerCase()
          User.findOneAndUpdate({ _id: req.params.id }, { $set: {avatar: nameFile}}, function (err, user) {
              if (err) {
                console.error(err);
                res.send(err);
              }
            });
          cb(null, nameFile);
        }
      })
    }).array('avatar', 1);

upload(req, res, function (error) {
  if (error) {
    console.log(error);
  }
  res.status(201).send({
    success: true, 
    data: 'File uploaded successfully.'
  })
});
});

router.post('/admin/:id', up.any(),  async (req, res) => {
  const AddressData = JSON.parse(req.body.address);
  const AdminData = JSON.parse(req.body.admin);
  User.findById(req.params.id, (err, user) => {
    user.address.push({
      firstname: AddressData.firstname,
      lastname: AddressData.lastname,
      gender: AddressData.gender,
      dateOfBirth: AddressData.dateOfBirth,
      idNumber: AddressData.idNumber,
      phoneNumber: AddressData.phoneNumber,
      cellphoneNumber: AddressData.cellphoneNumber,
      emergencyPhone: AddressData.emergencyPhone,
      province: AddressData.province,
      canton: AddressData.canton,
      city: AddressData.city,
      neighborhood: AddressData.neighborhood,
      mainStreet: AddressData.mainStreet,
      nomenclature: AddressData.nomenclature,
      secondaryStreet: AddressData.secondaryStreet
    })
    user.admin.push({
      taxType: AdminData.taxType,
      taxNumberRuc: AdminData.taxNumberRuc,
      taxNumberRise: AdminData.taxNumberRise,
      keepAccounting: AdminData.keepAccounting,
      personType: AdminData.personType,
      businessName: AdminData.businessName,
      socialReason: AdminData.socialReason,
      productsBeingSold: AdminData.productsBeingSold,
      originOfProducts: AdminData.originOfProducts,
      numberLocals: AdminData.numberLocals,
      locals: AdminData.locals,
      qualifiedCraftman: AdminData.qualifiedCraftman,
      craftmanCalification: AdminData.craftmanCalification,
      sellerType: AdminData.sellerType,
      bloodType: AdminData.bloodType,
      height: AdminData.height,
      allergy: AdminData.allergy,
      allergicTo: AdminData.allergicTo,
      consumingMedicine: AdminData.consumingMedicine,
      medicamentBeingConsumed: AdminData.medicamentBeingConsumed,
      illness: AdminData.illness,
      affiliatedTo: AdminData.affiliatedTo,
      affiliatedToPrivate: AdminData.affiliatedToPrivate,
      conadisLicense: AdminData.conadisLicense,
      disability: AdminData.disability, 
      disabilityPer: AdminData.disabilityPer,
      retirement: AdminData.retirement,
      retirementDetails: AdminData.retirementDetails
    })
    user.save( err => {
        if (err) return console.log(err + ' PENE')
        res.status(200).send({success: true})
    })
  })
})

router.post('/covid/:id',  async (req, res) => {
  User.findById(req.params.id, (err, user) => {
    user.covid.push({
      cough: req.body.poll.cough,
      coughComment: req.body.poll.coughComment,
      fever: req.body.poll.fever,
      feverComment: req.body.poll.feverComment,
      headache: req.body.poll.headache,
      headacheComment: req.body.poll.headacheComment,
      dyspnoea: req.body.poll.dyspnoea,
      dyspnoeaComment: req.body.poll.dyspnoeaComment,
      diarrheaOrVomiting: req.body.poll.diarrheaOrVomiting,
      diarrheaOrVomitingComment: req.body.poll.diarrheaOrVomitingComment,
      lossOfSmell: req.body.poll.lossOfSmell,
      lossOfSmellComment: req.body.poll.lossOfSmellComment,
      lossOfTaste: req.body.poll.lossOfTaste,
      lossOfTasteComment: req.body.poll.lossOfTasteComment,
      inContactWithFeverOrCoughSickPeople: req.body.poll.inContactWithFeverOrCoughSickPeople,
      inContactWithFeverOrCoughSickPeopleComment: req.body.poll.inContactWithFeverOrCoughSickPeopleComment,
      hasTravaledInThePast14Days: req.body.poll.hasTravaledInThePast14Days,
      hasTravaledInThePast14DaysComment: req.body.poll.hasTravaledInThePast14DaysComment,
      hasGoneToDoctorDueToRespiratorySymptoms: req.body.poll.hasGoneToDoctorDueToRespiratorySymptoms,
      hasGoneToDoctorDueToRespiratorySymptomsComment: req.body.poll.hasGoneToDoctorDueToRespiratorySymptomsComment,
      consumedRespiratoryMedicamentInThePast14Days: req.body.poll.consumedRespiratoryMedicamentInThePast14Days,
      consumedRespiratoryMedicamentInThePast14DaysComment: req.body.poll.consumedRespiratoryMedicamentInThePast14DaysComment,
      withoutFeverLast3DaysWithoutMedicaments: req.body.poll.withoutFeverLast3DaysWithoutMedicaments,
      withoutFeverLast3DaysWithoutMedicamentsComment: req.body.poll.withoutFeverLast3DaysWithoutMedicamentsComment,
      haveReceivedARelativeWithRiskOfCovidInThePast14Days: req.body.poll.haveReceivedARelativeWithRiskOfCovidInThePast14Days,
      haveReceivedARelativeWithRiskOfCovidInThePast14DaysComment: req.body.poll.haveReceivedARelativeWithRiskOfCovidInThePast14DaysComment,
      haveLivedWithSomeoneWithRiskOfCovidInThePast14Days: req.body.poll.haveLivedWithSomeoneWithRiskOfCovidInThePast14Days,
      haveLivedWithSomeoneWithRiskOfCovidInThePast14DaysComment: req.body.poll.haveLivedWithSomeoneWithRiskOfCovidInThePast14DaysComment,
      diabetes: req.body.poll.diabetes,
      diabetesComment: req.body.poll.diabetesComment,
      cardiorespiratoryDiseases: req.body.poll.cardiorespiratoryDiseases,
      cardiorespiratoryDiseasesComment: req.body.poll.cardiorespiratoryDiseasesComment,
      kidneyDiseases: req.body.poll.kidneyDiseases,
      kidneyDiseasesComment: req.body.poll.kidneyDiseasesComment,
      respiratoryDiseases: req.body.poll.respiratoryDiseases,
      respiratoryDiseasesComment: req.body.poll.respiratoryDiseasesComment,
      immunodeficiency: req.body.poll.immunodeficiency,
      immunodeficiencyComment: req.body.poll.immunodeficiencyComment,
      pregnantOrLactancy: req.body.poll.pregnantOrLactancy,
      pregnantOrLactancyComment: req.body.poll.pregnantOrLactancyComment,
      cancer: req.body.poll.cancer,
      cancerComment: req.body.poll.cancerComment,
      over60YearsOld: req.body.poll.over60YearsOld,
      over60YearsOldComment: req.body.poll.over60YearsOldComment,
      allInformationIsTrue: req.body.poll.allInformationIsTrue
    })
    user.save( err => {
        if (err) return console.log(err + ' PENE')
        res.status(200).send({success: true})
    })
  })
})

module.exports = router;
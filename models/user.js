const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    taxType: {
        type: String,
        trim: true,
        required: true,
        enum: ['ruc', 'rise', 'none']
    },
    taxNumber: {
        type: String,
        required: function() { return this.taxType === 'ruc' || this.taxType === 'rise' },
        maxlength: 13,
        minlength: 10
    },
    keepAccounting: {
        type: Boolean,
        required: function() { return this.taxType === 'ruc'},
    },
    personType: {
        type: String,
        trim: true,
        required: true,
        enum: ['Propietario', 'Arrendatario', 'Posecionario', 'Comodatario', 'Apoderado']
    },
    businessName: {
        type: String,
        trim: true,
        required: true
    },
    socialReason: {
        type: String,
        trim: true,
        required: true
    },
    productsBeingSold: [
        {
            productName: {
                type: String,
                enum: [
                    'Blusas',
                    'Calzado',
                    'Camisa',
                    'Camisetas',
                    'Chompas',
                    'Jean',
                    'Lencería',
                    'Pantalón de Tela',
                    'Ropa de bebé',
                    'Ropa de dormir',
                    'Ropa de cuero',
                    'Ropa de Niños',
                    'Suéter',
                    'Trajes hombre',
                    'Trajes mujer',
                    'Varios'
                ]},
        }
    ],
    originOfProducts: {
        type: String,
        trim: true,
        required: true
    },
    numberLocals: {
        type: Number,
        required: true,
        max: 3
    },
    locals: [
        {
            localNumber: String,
            predioNumber: String,
            sector: String,
            floor: String,
            hallNumber: String
        }
    ],
    qualifiedCraftman: {
        type: Boolean,
        required: true
    },
    craftmanCalification: {
        type: Number,
        required: function() { return this.qualifiedCraftman === true}
    },
    sellerType: {
        type: String,
        required: true,
        enum: ['Fabricante', 'Comercializador', 'Ambas']
    } ,
    bloodType: {
        type: String,
        required: true,
        enum: ['O+', 'A+', 'B+', 'AB+', 'A+', 'O-', 'A-', 'B-', 'AB-']
    },
    height: {
        type: Number,
        required: true
    },
    allergy: {
        type: Boolean,
        required: true
    },
    allergicTo: {
        type: String,
        required: function() { return this.allergy === true}
    },
    consumingMedicine: {
        type: Boolean,
        required: true
    },
    medicamentBeingConsumed: {
        type: String,
        required: function() { return this.consumingMedicine === true}
    },
    illness: {
        type: String,
        trim: true,
        required: true
    },
    affiliatedTo: {
        type: String,
        enum: ['IESS', 'ISFA', 'Privado']
    },
    affiliatedToPrivate: {
        type: String,
        required: function() { return this.affiliatedToPrivate === 'Privado'}
    },
    conadisLicense: {
        type: Boolean,
        required: true
    },
    disability: {
        type: String,
        required: function() { return this.conadisLicense === true}
    }, 
    disabilityPer: {
        type: String,
        required: function() { return this.conadisLicense === true}
    },
    retirement: {
        type: Boolean,
        required: true
    },
    retirementDetails: {
        type: String,
        required: function() { return this.retirement === true}
    }
})

const AddressSchema = new Schema({
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    idNumber: {
        type: String,
        required: true,
        maxlength: 10
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 10
    },
    cellphoneNumber: {
        type: String,
        required: true,
        maxlength: 10
    },
    emergencyPhone: {
        type: String,
        required: true,
        maxlength: 10
    },
    province: {
        type: String,
        trim: true,
        required: true
    },
    canton: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    neighborhood: {
        type: String,
        trim: true,
        required: true
    },
    mainStreet: {
        type: String,
        trim: true,
        required: true
    },
    nomenclature: {
        type: String,
        trim: true,
        required: true
    },
    secondaryStreet: {
        type: String,
        trim: true,
        required: true
    }
})

const covidSchema = new Schema({
    cough: {
        type: Boolean,
        required: true
    },
    coughComment: {
        type: String,
        trim: true,
        required: false
    },
    fever: {
        type: Boolean,
        required: true
    },
    feverComment: {
        type: String,
        trim: true,
        required: false
    },
    headache: {
        type: Boolean,
        required: true
    },
    headacheComment: {
        type: String,
        trim: true,
        required: false
    },
    dyspnoea: {
        type: Boolean,
        required: true
    },
    dyspnoeaComment: {
        type: String,
        trim: true,
        required: false
    },
    diarrheaOrVomiting: {
        type: Boolean,
        required: true
    },
    diarrheaOrVomitingComment: {
        type: String,
        trim: true,
        required: false
    },
    lossOfSmell: {
        type: Boolean,
        required: true
    },
    lossOfSmellComment: {
        type: String,
        trim: true,
        required: false
    },
    lossOfTaste: {
        type: Boolean,
        required: true
    },
    lossOfTasteComment: {
        type: String,
        trim: true,
        required: false
    },
    inContactWithFeverOrCoughSickPeople: {
        type: Boolean,
        required: true
    },
    inContactWithFeverOrCoughSickPeopleComment: {
        type: String,
        trim: true,
        required: false
    },
    hasTravaledInThePast14Days: {
        type: Boolean,
        required: true
    },
    hasTravaledInThePast14DaysComment: {
        type: String,
        trim: true,
        required: false
    },
    hasGoneToDoctorDueToRespiratorySymptoms: {
        type: Boolean,
        required: true
    },
    hasGoneToDoctorDueToRespiratorySymptomsComment: {
        type: String,
        trim: true,
        required: false
    },
    consumedRespiratoryMedicamentInThePast14Days: {
        type: Boolean,
        required: true
    },
    consumedRespiratoryMedicamentInThePast14DaysComment: {
        type: String,
        trim: true,
        required: false
    },
    withoutFeverLast3DaysWithoutMedicaments: {
        type: Boolean,
        required: true
    },
    withoutFeverLast3DaysWithoutMedicamentsComment: {
        type: String,
        trim: true,
        required: false
    },
    haveReceivedARelativeWithRiskOfCovidInThePast14Days: {
        type: Boolean,
        required: true
    },
    haveReceivedARelativeWithRiskOfCovidInThePast14DaysComment: {
        type: String,
        trim: true,
        required: false
    },
    haveLivedWithSomeoneWithRiskOfCovidInThePast14Days: {
        type: Boolean,
        required: true
    },
    haveLivedWithSomeoneWithRiskOfCovidInThePast14DaysComment: {
        type: String,
        trim: true,
        required: false
    },
    diabetes: {
        type: Boolean,
        required: true
    },
    diabetesComment: {
        type: String,
        trim: true,
        required: false
    },
    cardiorespiratoryDiseases: {
        type: Boolean,
        required: true
    },
    cardiorespiratoryDiseasesComment: {
        type: String,
        trim: true,
        required: false
    },
    kidneyDiseases: {
        type: Boolean,
        required: true
    },
    kidneyDiseasesComment: {
        type: String,
        trim: true,
        required: false
    },
    respiratoryDiseases: {
        type: Boolean,
        required: true
    },
    respiratoryDiseasesComment: {
        type: String,
        trim: true,
        required: false
    },
    immunodeficiency: {
        type: Boolean,
        required: true
    },
    immunodeficiencyComment: {
        type: String,
        trim: true,
        required: false
    },
    pregnantOrLactancy: {
        type: Boolean,
        required: true
    },
    pregnantOrLactancyComment: {
        type: String,
        trim: true,
        required: false
    },
    cancer: {
        type: Boolean,
        required: true
    },
    cancerComment: {
        type: String,
        trim: true,
        required: false
    },
    over60YearsOld: {
        type: Boolean,
        required: true
    },
    over60YearsOldComment: {
        type: String,
        trim: true,
        required: false
    },
    allInformationIsTrue: {
        type: Boolean,
        required: true
    }
})

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        default: 'user',
        trim: true,
        required: true,
        enum: ['user', 'admin', 'owner']
    },
    confirmationCode: {
        type: String
    },
    address: [AddressSchema],
    admin: [adminSchema],
    covid: [covidSchema],
    created: {
        type: Date,
        default: Date.now
    }
})

const User = model('user', userSchema)

module.exports = User
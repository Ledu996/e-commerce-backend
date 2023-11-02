const { hash, compare } = require('bcrypt');
const  jwt = require('jsonwebtoken');
const { User } = require('../../models/index');

// CREATE AN API DOCUMENTATION USING SWAGGER THAT IS FOR LATER

// Customer and Driver functionality 
// Admins are already registered inside of a system

const register = async (req, res) => {   
    const { 
        firstname,
        lastname,
        username, 
        password, 
        email, 
        address, 
        phone, 
        gender,
        dateOfBirth,
        typeOfUser
    } = req.body;

    const user = await User.findOne({$or: [{ username }, { email }] });
    if (user) return res.status(400).json({message: 'User already exists', results: null})
    
    let hashedPassword = await hash(password, 10);

    // validation token for later but it is saved on user document

    // maybe later set a condition if you need to fill other fields that are not related for Driver and Customer
    const createdUser = await User.create({
        ...req.body,
        password: hashedPassword,
        type_of_role: typeOfUser == 'Customer' ? 'Customer' : 'Driver',
    })
    
    const access_token = await jwt.sign({_id: createdUser._id}, 'secret', {expiresIn: '1h'}); // 7d 
    res.status(200).json({message: "User created successfully", results: {createdUser, access_token}});
    }
    
    // confirm account on the email


// see a flow for this and check it out

const checkVerificationTokenExpire = async (req, res, next) => {
    // always set security on upper level
    // every time we visit the email confirm page this will run
    // verify the token
    // if expired assign the new token with the same time
    // send a new email address with newly generated token
    // define some local variables above try so you can access them
    const token = req.headers.authorization.split(' ')[1];
    const verified = await jwt.verify(token, 'secret');
    
    if(!verified) console.log('User not verified')// return error in here
    
    try {
        const user = await User.findOne({ _id: verified._id });
        const validationVerification = await jwt.verify(user.verificationToken);
        // address stays the same for an email
    } catch (err) {
        const newValidationToken = await jwt.sign({_id: verified._id}, 'secret', {expiresIn: '24h'});
        await User.findOneAndUpdate({_id: verified._id}, {validationToken: newValidationToken});
        // send new email with new link
        // return response
        res.status(200).json({
            message: 'Sent verification email again, please check your email address', 
            results: []
    })
    }
    // verify this one if expired attach new one, send a new link
    // we will see the strategies 
}

const confirmRegistration = async (req, res) => { // PATCH    

    const  { token } = req.params;
    // find user with the same token, if he exists update his status
    await User.findOneAndUpdate({ verificationToken: token }, { isVerified: true });
    res.status(200).json({message: 'Email successfully confirmed', results: null});
    // this is where we confirm this stuff
    // update isActive to  true 
}

const login = async (req, res) => {
    // validation of data that we send here can be done on frontend
    const { username, password } = req.body;
    // check if user exists and
    const user = await User.findOne( { username } );
    if (!user) return res.status(404).json({message: 'User does not exist, please register', results: null});
    // compare passwords 
    // all the values will be hashed, in the database
    const { password: hashedPassword } = user;
    // does this compare, hash a password inside of it, yes, does the encryption
    const isValid = await compare(password, hashedPassword);
    
    if(!isValid) return res.status(401).json({message: 'Wrong credentials'});

    // this query runs because we need to update the user status on the database
    await User.findOneAndUpdate({ username }, { isActive: true }).lean() // status update
    // create a token 
    // see the strategies after
    const accessToken = await jwt.sign({_id: user._id}, 'secret', {expiresIn: '1h'})
    return res.status(200).json({message: '', results: { accessToken, state: user.address.state, role: user.type_of_role }}); // type of role
    // compare passwordInput with password, if not matching password throw an error
    // if it is good assign token to a specific user
    
};

const getUserProfile = async (req, res) => {
    const { id: _id } = req.params;
    const user = await User.findOne({ _id});
    if (!user) return res.status(404).json({message: 'User not found', results: null});
    return res.status(200).json({message: 'Success', results: user});
}; 

module.exports = {
    login,
    register,
    checkVerificationTokenExpire,
    getUserProfile,
    confirmRegistration,
}
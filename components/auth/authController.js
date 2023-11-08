const { hash, compare } = require('bcrypt');
const { getTokens, refreshAccessToken } = require('../../lib/jwtHandler');
const  jwt = require('jsonwebtoken');
const { User, Address } = require('../../models/index');



const register = async (req, res) => {   

    try {
    const { 
        firstname: firstName,
        lastname: lastName,
        username, 
        password, 
        email, 
        address: {
            street,
            number,
            municipality,
            city,
            apartmentNumber,
        }, 
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
    // create an address first, take the id of an address and save inside user document
    // or other way around create a user than check for an address

    let [ newUser, existingAddress ] = await Promise.all([
        User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            phone,
            gender,
            type_of_role: typeOfUser == 'Customer' ? 'Customer' : 'Driver',
        }),

        Address.findOne({
            street, 
            number, // street number
            apartmentNumber,
            municipality,
            city
        }),
    ])
    if(!existingAddress) {
        existingAddress = new Address({street, number, municipality, city, apartmentNumber})
    }

    newUser.address = existingAddress._id;
    existingAddress.users.push(newUser._id);
    await newUser.save();
    await existingAddress.save();
    
    // has to log in or go to protected routes
        res.status(200).json({message: "User created successfully", results:  {}});
    } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
}

const login = async (req, res) => {
    // validation of data that we send here can be done on frontend
    const { username, password } = req.body;
    const user = await User.findOne( { username } );
    
    if (!user) return res.status(404).json({message: 'User does not exist, please register', results: null});
    
    const { password: hashedPassword } = user;
    // does this compare, hash a password inside of it, yes, does the encryption
    const isValid = await compare(password, hashedPassword);
    
    if(!isValid) return res.status(401).json({message: 'Wrong credentials'});

    // this query runs because we need to update the user status on the database
    await User.findOneAndUpdate({ username }, { isActive: true }).lean() 
    const tokens = await getTokens(user);
    const { acc_token: accessToken, refresh_token } = tokens;
    res.cookie('jwt', refresh_token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000,  });
    return res.status(200).json({message: 'Login successful', results: { accessToken }});  
};


// 1) refresh token rotation strategy
// - every time we exchange a refresh token, a new refresh token is also generated
  // leveling up the security of our app

// 2) Refresh Token Automatic Reuse Detection, will implement in the future
// unable refresh token family inside of a user document
// safe to store in a database ? 
// threat all users as malicious 

const handleRefreshToken = async (req, res) => { // 1)
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(403).json({message: 'User has to be authorized'});
  
    const refreshToken = cookies.jwt;
    const verifiedToken = await jwt.verify(refreshToken, 'refresh_secret');

    if(!verifiedToken) return res.status(403).json({message: 'User is not authorized'});
    // new pair of refresh and access token
    const { acc_token: newAccessToken, refresh_token } = await refreshAccessToken(refreshToken);
    res.cookie('jwt', refresh_token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).json({message: 'New access token generated', results: {acc_token: newAccessToken}})
};



const logout = async (req, res) => {
    // clear cookie here
    const { _id } = req.user;
    const user = await User.findOne({ _id }); 
    if(!user) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.status(204).json({message: 'No content', message: null})
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    await User.findOneAndUpdate({ _id }, {isActive: false});
    return res.status(200).json({message: 'Successfully logged out', message: null})
};


module.exports = {
    register,
    login,
    handleRefreshToken,
    logout
}









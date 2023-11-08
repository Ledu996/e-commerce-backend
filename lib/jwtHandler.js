const jwt = require('jsonwebtoken');



// detect refresh token reuse token reuse 
const refreshAccessToken = async (refreshToken) => {
    try {
      // Validate the refresh token (verify its authenticity and expiration)
      const verifiedRefreshToken = await jwt.verify(refreshToken, 'refresh_secret');
      const { acc_token, refresh_token }  = await getTokens(verifiedRefreshToken);
      
      return { acc_token, refresh_token };
    } catch (error) {
        console.log('Error here ', error.message);
      // Handle any errors related to token validation or generation
      throw new Error('Error refreshing access token');
    }
}

const getTokens = async (payload) => {
    console.log('Payload: ', payload);
    const [acc_token, refresh_token ] = await Promise.all([
        jwt.sign({_id: payload._id}, 'acc_secret', { expiresIn: '1h' }),
        jwt.sign({_id: payload._id }, 'refresh_secret', { expiresIn: '7d' })
    ])
    return {
        acc_token,
        refresh_token
    }
}


module.exports = {
    refreshAccessToken,
    getTokens,
}

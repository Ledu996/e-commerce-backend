const jwt = require('jsonwebtoken');



// detect refresh token reuse token reuse 
const refreshAccessToken = async (refreshToken) => {
    try {
        console.log('REFRESH_TOKEN HERE ', refreshToken);
      // Validate the refresh token (verify its authenticity and expiration)
      const verifiedRefreshToken = await jwt.verify(refreshToken, 'refresh_secret');
      console.log('Verified refresh token: ', verifiedRefreshToken);
      const newPairOfTokens = await getTokens(verifiedRefreshToken);
      const { acc_token, refresh_token } = newPairOfTokens;
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
        jwt.sign({_id: payload._id}, 'acc_secret', { expiresIn: '10m' }),
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

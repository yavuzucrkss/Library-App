
export const oktaConfig = {
    issuer: 'https://dev-46440973.okta.com/oauth2/default', // Okta kimlik doğrulama hizmetinin URL'si
    //issuer: process.env.ISSUER, // Okta kimlik doğrulama hizmetinin URL'si
    redirectUri: window.location.origin + '/login/callback', // Kimlik doğrulama işlemi tamamlandıktan sonra yönlendirilecek URL
    clientId: '0oaao8ug5hneOM6255d7', // Okta tarafından sağlanan istemci kimliği 
    //clientId: process.env.CLIENT_ID, // Okta tarafından sağlanan istemci kimliği
    scopes: ['openid', 'profile', 'email'], // Kimlik doğrulama işlemi sırasında istenen izinler
    pkce: true, // Kimlik doğrulama işlemi sırasında kullanılacak PKCE yönteminin kullanılıp kullanılmayacağı
    disableHttpsCheck: true // HTTPS sertifikası doğrulamasının devre dışı bırakılıp bırakılmayacağı
};
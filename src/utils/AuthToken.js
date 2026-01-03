export const AuthToken = () => {
    const token = localStorage.getItem('photobooth_token');
    if (token) {
        return token;
    }
    return null;
}

export const AuthEmail = () => {
    const email = localStorage.getItem('photobooth_email');
    if (email) {
        return email;
    }
    return null;
}
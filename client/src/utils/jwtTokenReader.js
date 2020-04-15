import decode from 'jwt-decode';

export function checkAdminUserRole(jwtToken) {
    if (jwtToken === null) {
        return false;
    }

    let jsonPayload = decode(jwtToken);
    return jsonPayload['roles'][0] === 'ROLE_ADMIN';
}

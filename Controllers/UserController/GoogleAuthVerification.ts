import { OAuth2Client } from 'google-auth-library';

export default async function verifyGoogleAuthToken(idToken: string){
    const audience = process.env.GOOGLE_CLIENT_ID;
    if(!audience){
    throw new Error(`Client Id is not configured properly `)
    }
    const client = new OAuth2Client();
    const ticket =  await client.verifyIdToken({
        idToken,
        audience
    });
    return ticket.getPayload();
}
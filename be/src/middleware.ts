import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';



export const middleware = (req: any, res : any, next : any) => {
    const authHeader: string | undefined = req.headers.authorization;
    if (authHeader) {
        const token: string = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
            req.user = decoded.userId;  // ONLY store the userId
            console.log('userid:', decoded); // Should be a number or string, not an object

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

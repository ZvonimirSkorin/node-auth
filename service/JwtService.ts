import jwt from "jsonwebtoken"

export class JwtService {
    private static jwtService: JwtService;
    private secret: string
    constructor(jwtSecret?: string) {
        this.secret = jwtSecret || process.env.JWT_SECRET!;
    }

    public static getJwtService(){
        if(!this.jwtService) this.jwtService = new JwtService();
        return this.jwtService
    }

    public generateJwt(payload: any, tokenExpiration:Date, secret?: string): string{
       return jwt.sign({...payload, iat: tokenExpiration}, this.secret);
    }

    public verifyToken(token: string, throwsException?: boolean): boolean{
        try{ jwt.verify(token, this.secret)
            return true;
        }catch(e){
            if(throwsException) throw e;
            return false;
        }
    }
}
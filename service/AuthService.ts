type Route = {
    route: string,
    exactPath?: boolean
}

type ProtectedRoute = Route &
{
    validationFunction?: Function
}

export class AuthService {
   

    public static authService: AuthService;
    private validationFunction?: Function
    private publicRoutes: Route[];
    private protectedRoutes: ProtectedRoute[]
    constructor(validationFunction?: Function, publicRoutes?: Route[], protectedRoutes?: ProtectedRoute[]) {
        this.validationFunction = validationFunction;
        this.publicRoutes = publicRoutes || [];
        this.protectedRoutes = protectedRoutes || [];
    }

    public static getInstance(validationFunction: Function){
        if(!this.authService) this.authService = new AuthService(validationFunction);
        return this.authService;
    }

    public decrypt(ciphertext: string ) {
        return CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_SECRET as string).toString(CryptoJS.enc.Utf8); 
    }
    public  encrypt = (value:string):string =>{
       
return CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_SECRET as string).toString();

    }

    public validateUser(route: string){
       
        for(let r of this.publicRoutes){
            let isOpen = false;
            if(r.exactPath) isOpen = r.route === route; 
            else isOpen = r.route.includes(route)
            if(isOpen) return true;
        }

        const validationFun = this.protectedRoutes.filter(r=>{
            let isOpen = false;
            if(r.exactPath) isOpen = r.route === route; 
            else isOpen = r.route.includes(route)
            return isOpen;
        })?.at(0)?.validationFunction || this.validationFunction
        

        if(validationFun) validationFun();
        else throw Error("Validation function isn't defined")
    }
}
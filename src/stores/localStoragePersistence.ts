export type UserProfile = {
    id: string,
    email: string,
    name: string,
    avatar_url: string,
  };
  
export class LocalStoragePersistence {
    private static KEYS = {
        USERID: "granaFlow.userId",
        USEREMAIL: "granaFlow.userEmail",
        USERNAME: "granaFlow.userName",
        USERPHOTO: "granaFlow.userPhoto",
        JWT_TOKEN: "granaFlow.jwt",
        JWT_REFRESH_TOKEN: "granaFlow.refresh.jwt",
    }
  
    static setUserProfile(userProfile: UserProfile): void {
        window.localStorage.setItem(this.KEYS.USERID, userProfile.id)
        window.localStorage.setItem(this.KEYS.USEREMAIL, userProfile.email)
        window.localStorage.setItem(this.KEYS.USERNAME, userProfile.name)
        window.localStorage.setItem(this.KEYS.USERPHOTO, userProfile.avatar_url)
    }
  
    static getUserProfile(): UserProfile | null {
        const id = window.localStorage.getItem(this.KEYS.USERID)
        const email = window.localStorage.getItem(this.KEYS.USEREMAIL)
        const name = window.localStorage.getItem(this.KEYS.USERNAME)
        const avatar_url = window.localStorage.getItem(this.KEYS.USERPHOTO)
  
        if (id && email && name && avatar_url) {
            return { id, email, name, avatar_url }
        }
  
        return null
    }
  
    static deleteAll(): void {
        this.clearTokens()
        window.localStorage.removeItem(this.KEYS.USERID)
        window.localStorage.removeItem(this.KEYS.USEREMAIL)
        window.localStorage.removeItem(this.KEYS.USERNAME)
        window.localStorage.removeItem(this.KEYS.USERPHOTO)
    }
  
    static clearTokens(): void {
        window.localStorage.removeItem(this.KEYS.JWT_TOKEN)
        window.localStorage.removeItem(this.KEYS.JWT_REFRESH_TOKEN)
    }
  
    static setJWT(value: string): void {
        window.localStorage.setItem(this.KEYS.JWT_TOKEN, value)
    }
  
    static getJWT(): string | null {
        return window.localStorage.getItem(this.KEYS.JWT_TOKEN)
    }
  
    static setRefreshJWT(value: string): void {
        window.localStorage.setItem(this.KEYS.JWT_REFRESH_TOKEN, value)
    }
  
    static getRefreshJWT(): string | null {
        return window.localStorage.getItem(this.KEYS.JWT_REFRESH_TOKEN)
    }
  
    static setUserId(value: string): void {
        window.localStorage.setItem(this.KEYS.USERID, value)
    }
  
    static getUserId(): string | null {
        return window.localStorage.getItem(this.KEYS.USERID)
    }
  }
  
export interface IUser {
  email: string
  password: string
  age: number
  phoneNumber?: string
  name: string
}
export default class UserModel implements IUser {
  email!: string
  password!: string
  age: number = 18
  phoneNumber!: string
  name!: string
}

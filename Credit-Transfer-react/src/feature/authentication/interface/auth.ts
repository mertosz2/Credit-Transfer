export interface ISignIn {
  username: string
  password: string
}

export interface ITokenPayload {
  role: []
  user_id: number
  user_name: string
  name: string
}

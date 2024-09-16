export interface ISignIn {
  username: string
  password: string
}

export interface IToken {
  token: string
}
export interface ITokenPayload {
  role: []
  user_id: string
  user_name: string
  name: string
}

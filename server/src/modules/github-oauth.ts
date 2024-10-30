import { env } from "../config/env"

interface AccessTokenResponse {
  access_token: string
}

interface GetUserResponse {
  id: number
  name: string | null
  email: string | null
  avatar_url: string
}

export async function getAccessTokenFromCode(code: string) {
  const accessTokenUrl = new URL('https://github.com/login/oauth/access_token')

  accessTokenUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
  accessTokenUrl.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET)
  accessTokenUrl.searchParams.set('code', code)

  const response = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  })

  const { access_token }: AccessTokenResponse = await response.json()

  return { access_token }
}

export async function getUserFromAccessToken(accessToken: string) {
  const userUrl = new URL('https://api.github.com/user')
  const response = await fetch(userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const data: GetUserResponse = await response.json()

  return data
}
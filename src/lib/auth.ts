import { redirect, type RequestEvent } from "@sveltejs/kit";
import jwt from 'jsonwebtoken'
import {env} from "$env/dynamic/private"

const {JWT_SECRET} = env


export const isAuthorized = ({cookies}: RequestEvent) => {
  const token = cookies.get('token')
  
  try {
    if(!token) throw new Error('Missing token')
    jwt.verify(token, JWT_SECRET)
    return true
  } catch (error) {
    return false
  }
}

export const redirectIfUnauthorized = (event: RequestEvent) => {
  if(!isAuthorized(event)) throw redirect(307, '/login')
}




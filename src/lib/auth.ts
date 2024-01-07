import type { RequestEvent } from "@sveltejs/kit";
import jwt from 'jsonwebtoken'
import {env} from "$env/dynamic/private"

const {JWT_SECRET} = env

export const checkAuth = async ({cookies}: RequestEvent) => {
  const token = cookies.get('token')
  if(!token) throw 'No token'
  jwt.verify(token, JWT_SECRET)
}




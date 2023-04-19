export default defineNuxtRouteMiddleware(async (to, from) => {
  const jwt = useCookie("jwt")
  const user = useUser()
  if (!jwt.value) {
    user.value = null
    return
  }
  const runtimeConfig = useRuntimeConfig()
  const { idenfiticationUrl } = runtimeConfig.public
  const headers = { authorization: `Bearer ${jwt.value}` }
  try {
    user.value = await $fetch<any>(idenfiticationUrl, { headers })
  } catch (error) {
    console.error(error)
    user.value = null
  }
})

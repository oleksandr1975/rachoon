export default defineNuxtRouteMiddleware((to, from) => {
  if (!useAuth().key() && !["/login", "/signup"].includes(to.path)) {
    return navigateTo("login");
  }

  if (useAuth().key() && ["/login", "/signup"].includes(to.path)) {
    return navigateTo("");
  }

  if (
    useAuth().key() &&
    useProfile().me.email !== "" &&
    !to.path.includes("/settings") &&
    !to.path.includes("/logout") &&
    !to.path.includes("/profile") &&
    useProfile().me.organization.data.address.street === "" &&
    useProfile().me.organization.data.address.zip === "" &&
    useProfile().me.organization.data.address.city === "" &&
    useProfile().me.organization.data.address.country === ""
  ) {
    useToast(`Hey, ${useProfile().me.data.username}`, "Please setup your organiztion address first before proceeding.", "warning");
    return useRouter().replace("/settings/organization");
  }
});

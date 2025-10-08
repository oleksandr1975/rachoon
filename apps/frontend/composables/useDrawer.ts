export const useDrawer = () => {
  const isOpen = useState("drawer-open", () => false);
  const router = useRouter();

  // Close drawer on route change
  watch(
    () => router.currentRoute.value.path,
    () => {
      isOpen.value = false;
    },
  );

  return {
    isOpen,
    toggle: () => (isOpen.value = !isOpen.value),
    close: () => (isOpen.value = false),
    open: () => (isOpen.value = true),
  };
};

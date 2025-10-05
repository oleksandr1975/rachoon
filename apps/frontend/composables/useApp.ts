class AppStore {
  confirmModal = ref(null);
  confirmResult: Ref<null | boolean> = ref(null);
  confirmQuesion = ref("");
  previewOpen = ref(false);

  confirm = (cb: Function | Promise<any>, question?: string) => {
    if (question) {
      this.confirmQuesion.value = question;
    }
    this.confirmModal.value.showModal();
    const watcher = watch(this.confirmResult, async (val) => {
      if (val !== null) {
        this.confirmResult.value = null;
        this.confirmModal.value.close();
        watcher(); // stop watching
        if (val === true) {
          await cb();
          this.confirmQuesion.value = "";
        }
      }
    });
  };
}

export default defineStore("app", () => new AppStore());

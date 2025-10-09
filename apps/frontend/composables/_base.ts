import { type IBase } from "@repo/common/Base";
import type { getAllFunc } from "./useApi";
import { useDebounce, useDebounceFn, watchDebounced } from "@vueuse/core";

export default class Base<T extends IBase> {
  constructor(
    public item: Ref<T>,
    getAllFunc: getAllFunc<T>,
  ) {
    this.getAllFunc = getAllFunc;
    watch([computed(() => JSON.stringify(this.sortKeys.value)), computed(() => JSON.stringify(this.filterKeys.value))], () => {
      this.doRefresh();
    });
  }

  type = (firstToUpper = false): string => {
    let res = useRoute().path.split("/")[1];
    if (firstToUpper) res = res.charAt(0).toUpperCase() + res.slice(1);
    return res;
  };

  setAllFunc = (getAllFunc: getAllFunc<T>) => {
    this.getAllFunc = getAllFunc;
  };

  items: Ref<T[]> = ref([]);
  hasErrors = ref(false);
  getAllFunc: getAllFunc<T>;

  sortKeys = ref({});
  filterKeys = ref({});
  loadMore = ref(false);
  page = ref(1);
  pages = ref(0);
  loading = ref(false);
  perPage = ref(20);
  refresh = ref(false);
  search = ref("");
  watching = ref(false);

  singularType = (firstToUpper: boolean = false) => this.type(firstToUpper).slice(0, this.type(firstToUpper).length - 1);

  async filter(key: string, operator: string, value: string) {
    // if (!this.filterKeys.value[key]) {
    //   this.filterKeys.value = { ...this.filterKeys.value, [key]: { operator: operator, value: value } };
    // } else {
    //   const tmp = this.sortKeys.value;
    //   tmp[key] = { operator: operator, value: value };
    //   this.filterKeys.value = tmp;
    // }
  }

  watchSearch = () => {
    watchDebounced(
      this.search,
      () => {
        this.doRefresh();
      },
      { debounce: 200 },
    );
  };

  isNew = () => (useRoute().params["id"] as string) === "new";
  async save(e: Event) {
    e.preventDefault();
    if (this.item.value!.errors().length > 0) {
      this.hasErrors.value = true;
      return;
    }
    this.hasErrors.value = false;
  }

  sort = (sortKeys: any) => {
    this.sortKeys.value = sortKeys;
  };

  doRefresh = () => {
    this.refresh.value = true;
    this.list();
  };

  list = async () => {
    if (!this.refresh.value) {
      this.page.value = 1;
      this.search.value = "";
      this.loading.value = true;
    }
    const res = await this.getAllFunc(this.page.value, this.perPage.value, this.sortKeys.value, this.filterKeys.value, this.search.value);
    this.pages.value = res.pages;
    if (this.loadMore.value) {
      this.items.value = [...this.items.value, ...res.rows];
    } else {
      this.items.value = res.rows as T[];
    }
    this.loading.value = false;
    this.refresh.value = false;
  };

  hasMore = () => {
    return this.page.value < this.pages.value;
  };

  doLoadMore = () => {
    if (this.hasMore()) {
      this.loadMore.value = true;
      this.page.value++;
      this.list();
    }
  };
}

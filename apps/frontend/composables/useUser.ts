import { User } from "~~/models/user";
import _ from "lodash";
import Base from "./_base";

class UserStore extends Base<User> {
  save = async (e: Event) => {
    super.save(e);

    const isNew = this.item.value?.id === null;
    const u = await useApi().users().saveOrUpdate(this.item.value!, !isNew);
    if (isNew) {
      useRouter().replace(`/${this.type}/${u.id}`);
    }
  };

  form = async () => {
    const id = useRoute().params["id"] as string;

    this.loading.value = true;
    this.item.value = new User();
    if (id !== "new") {
      this.item.value = _.mergeWith(this.item.value, await useApi().users().get(id));
    }

    this.loading.value = false;
  };
}

export default defineStore("user", () => new UserStore(ref(new User()), useApi().users().getAll));

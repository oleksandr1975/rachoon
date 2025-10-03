import { Template } from "~~/models/template";
import _ from "lodash";
import Base from "./_base";

class TemplateStore extends Base<Template> {
  cached = ref<{ [id: string]: Template }>({});
  defaultTemplate = ref(new Template());

  save = async (e: Event) => {
    super.save(e);
    const isNew = this.item.value?.id === "";
    const c = await useApi().templates().saveOrUpdate(this.item.value!, !isNew);
    if (isNew) {
      useRouter().replace(`/${this.type}/${c.id}`);
    }
  };

  get = async (id: string): Promise<Template> => {
    if (this.cached.value[id]) {
      return this.cached.value[id];
    }
    this.loading.value = true;

    const t = id === "default" ? await useApi().templates().getDefault() : await useApi().templates().get(id);
    const tpl = _.mergeWith(new Template(), t);
    this.cached.value[id] = tpl;
    this.loading.value = false;
    return tpl;
  };

  duplicate = async (id: string) => {
    this.loading.value = true;
    const duplicate = await useApi().templates().duplicate(id);
    useRouter().push(`/templates/${duplicate.id}`);
    this.loading.value = false;
  };

  getDefault = async () => {
    this.loading.value = true;
    this.defaultTemplate.value = await useApi().templates().getDefault();
    this.loading.value = false;
  };

  form = async () => {
    const id = useRoute().params["id"] as string;

    this.loading.value = true;
    this.item.value = new Template();
    if (id !== "new") {
      this.item.value = _.mergeWith(this.item.value, await useApi().templates().get(id));
    }

    this.loading.value = false;
  };
}

export default defineStore("template", () => new TemplateStore(ref(new Template()), useApi().templates().getAll));

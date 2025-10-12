import { Settings } from "~~/models/settings";
import _ from "lodash";

interface OrganizationData {
  info: {
    vat: string;
    addition: string;
  };
  address: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  logo: string;
  columns: {
    first: string;
    second: string;
    third: string;
  };
}

class Organization {
  id: string = "";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  name: string = "";
  slug: string = "";
  data: OrganizationData = {
    address: { street: "", zip: "", city: "", country: "" },
    info: { vat: "", addition: "" },
    logo: "",
    columns: {
      first: "",
      second: "",
      third: "",
    },
  };
  settings: Settings = new Settings();

  constructor(json?: any) {
    if (json) {
      _.merge(this, json);
      this.settings = new Settings(this.settings);
    }
  }
  public toJSON() {
    return { ...this };
  }
}

export { Organization };
export type { OrganizationData };

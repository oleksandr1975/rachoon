import * as dateFns from "date-fns";
import type { DiscountCharge, TaxOption, TaxRate } from "./document";
import _ from "lodash";
interface SettingsData {
  general: {
    currency: string;
    locale: string;
  };
  style: {
    colors: {
      primary: string;
      secondary: string;
      bodyText: string;
      border: string;
      headerBackground: string;
      headerText: string;
      footerBackground: string;
      footerText: string;
      tableEvenBackground: string;
      tableOddBackground: string;
    };
    template: string;
  };
  units: Array<{ title: string; default: boolean }>;
  invoices: {
    title: String;
    number: {
      format: String;
      padZeros: number;
    };
    dueDays: number;
  };
  offers: {
    title: String;
    number: {
      format: String;
      padZeros: number;
    };
    dueDays: number;
  };
  reminders: {
    title: String;
    number: {
      format: String;
      padZeros: number;
    };
    fees: DiscountCharge[];
    dueDays: number;
  };

  clients: {
    number: {
      format: String;
      padZeros: number;
    };
  };
  taxes: {
    rates: Array<TaxRate>;
    options: Array<TaxOption>;
  };
}

class Settings implements SettingsData {
  general = {
    currency: "USD",
    locale: "en-US",
  };
  style = {
    colors: {
      primary: "#7287fd",
      secondary: "#dc8a78",
      bodyText: "#1e1e2e",
      border: "#e6e9ef",
      headerBackground: "#e6e9ef",
      headerText: "#1e1e2e",
      footerBackground: "#1e1e2e",
      footerText: "#cdd6f4",
      tableEvenBackground: "#e6e9ef",
      tableOddBackground: "#ffffff",
    },
    template: "",
  };
  invoices = {
    title: "Invoice",
    number: {
      format: "INV-{number}-{date:yMMdd}",
      padZeros: 3,
    },
    dueDays: 30,
  };
  offers = {
    title: "Offer",
    number: {
      format: "OFF-{number}-{date:yMMdd}",
      padZeros: 3,
    },
    dueDays: 30,
  };
  reminders = {
    title: "Reminder",
    number: {
      format: "REM-{number}-{date:yMMdd}",
      padZeros: 3,
    },
    fees: [],
    dueDays: 30,
  };

  clients = {
    number: {
      format: "CLI-{number}-{date:yMMdd}",
      start: 0,
      padZeros: 3,
    },
  };

  units = [
    { title: "hours", default: true },
    { title: "days", default: false },
  ];

  taxes = {
    rates: [
      { rate: 10, default: false },
      { rate: 20, default: true },
    ],
    options: [
      { title: "Apply Taxes", applicable: true, default: true },
      { title: "Reverse Charge", applicable: false, default: false },
    ],
  };

  constructor(json?: any) {
    if (json) {
      _.merge(this, json);
    }
  }

  public setDefaultRate(index: number) {
    this.taxes.rates.map((r) => (r.default = false));
    this.taxes.rates[index].default = true;
  }

  public setDefaultUnit(index: number) {
    this.units.map((u) => (u.default = false));
    this.units[index].default = true;
  }

  public setDefaultOption(index: number) {
    this.taxes.options.map((o) => (o.default = false));
    this.taxes.options[index].default = true;
  }

  public removeTaxRate(index: number) {
    this.taxes.rates.splice(index, 1);
  }
  public removeUnit(index: number) {
    this.units.splice(index, 1);
  }

  public removeFee(index: number) {
    this.reminders.fees.splice(index, 1);
  }
  public removeTaxOption(index: number) {
    this.taxes.options.splice(index, 1);
  }
  public addTaxRate() {
    this.taxes.rates.push({ rate: null, default: false });
  }
  public addUnit() {
    this.units.push({ title: "", default: false });
  }

  public addFee() {
    this.reminders.fees.push({
      title: "Reminder fee",
      value: 0,
      type: "charge",
      valueType: "fixed",
    });
  }
  public addTaxOption() {
    this.taxes.options.push({ title: "", default: false, applicable: true });
  }
  public toJSON() {
    return { ...this };
  }
}

export { Settings };
export type { SettingsData };

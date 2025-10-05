import * as dateFns from "date-fns";
import { ClientType } from "./Client";
import _ from "lodash";
import Helpers from "./Helpers";

export interface RecurringType {
  id: string;
  cron: string;
  active: boolean;
  startDate: Date;
  nextRun: Date;
  invoiceId: string;
}

class Recurring implements RecurringType {
  id: string = "";
  cron: string = "";
  active: false;
  startDate: Date = new Date();
  nextRun: Date = new Date();
  invoiceId: string = "";
  invoice: DocumentType;

  constructor(json?: any) {
    if (json) {
      Helpers.merge(this, json);
      this.startDate = new Date(Date.parse(json.startDate.toString()));
      this.nextRun = new Date(Date.parse(json.nextRun.toString()));
    }
  }
  toJSON() {
    return { ...this };
  }
}

export interface Position {
  id?: number;
  title: string;
  text?: string;
  quantity: number;
  unit: string;
  price: number;
  tax: number;
  taxPrice?: number;
  discount?: number;
  net?: number;
  netNoDiscount?: number;
  total?: number;
  focused?: boolean;
  totalPercentage?: number;
}

export interface TaxOption {
  title: String;
  applicable: boolean;
  default: boolean;
}

export interface TaxRate {
  rate: number;
  default: boolean;
}

export interface DiscountCharge {
  id?: string;
  title: string;
  value: number;
  type: string;
  valueType: string;
  amount: number;
}

export interface DocumentData {
  title: string;
  positions: Position[];
  discountsCharges: DiscountCharge[];
  taxes: { [rate: number]: number };
  headingText: string;
  footerText: string;
  date: Date;
  dueDate: Date;
  dueDays: number;
  total: number;
  net: number;
  netNoDiscount: number;
  taxOption: TaxOption;
}

export type DocumentType = {
  id?: string;
  clientId: string;
  number: string;
  status: string;
  offerId: string | null;
  invoiceId: string | null;
  templateId: string | null;
  isRecurring: boolean;
  isFromRecurring: boolean;
  totalReminders: number;
  offer: DocumentType;
  invoices: DocumentType[];
  overdue: boolean;
  data: DocumentData;
  createdAt: Date;
  updatedAt: Date;
  recurringInvoice: RecurringType | null;
  type: string;
};

class Document implements DocumentType {
  id: string = "";
  clientId: string = null;
  client: ClientType;
  number: string = "";
  status: string = "pending";
  offerId = null;
  templateId = null;
  invoiceId = null;
  totalReminders: 0;
  isRecurring = false;
  isFromRecurring = false;
  overdue: false;
  offer: DocumentType;
  invoices: DocumentType[];
  recurringInvoice: RecurringType = null;
  data = {
    title: "",
    positions: [] as Position[],
    discountsCharges: [] as DiscountCharge[],
    taxes: {},
    date: new Date(),
    dueDate: new Date(),
    headingText: "",
    footerText: "",
    total: 0,
    dueDays: 14,
    net: 0,
    netNoDiscount: 0,
    taxOption: null as TaxOption | null,
  };

  type = "";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  timeout: any;

  constructor(json?: any) {
    if (json) {
      Helpers.merge(this, json);

      this.data.positions.map((p) => (p.focused = false));
      this.offer = new Document(json.offer);
      this.invoices = (json.invoices || []).map((i) => new Document(i));
      this.data.date = new Date(Date.parse(json.data.date.toString()));
      this.data.dueDate = new Date(Date.parse(json.data.dueDate.toString()));
      if (this.recurringInvoice) {
        this.recurringInvoice = new Recurring(json.recurringInvoice);
      }
    }
  }

  setTaxOption = (option: TaxOption) => {
    console.log(option);
    this.data.taxOption = option;
  };

  calculate() {
    this.calcPositions();
    this.calcTaxes();
    this.calcNet();
    this.calcTotal();
  }

  rebuild() {
    this.data.dueDays = dateFns.differenceInCalendarDays(
      this.data.dueDate,
      this.data.date,
    );
    if (this.data.positions.length === 0) {
      this.addPosition();
    }

    this.calculate();
  }

  errors = (): string[] => {
    const e = [];
    if (this.clientId === null) {
      e.push("You need to select a client");
    }
    return e;
  };

  convertedFromOffer = () => this.offerId !== null && this.offerId !== "";
  disabled = () => this.convertedFromOffer() || this.type === "reminder";

  calcPositions = () => {
    let sumPositions = this.data.positions.reduce(
      (p, c) => (p += c.quantity * c.price),
      0,
    );
    let sumPositionsNoDiscount = 0;
    this.data.positions.map((p) => {
      p.net = p.quantity * p.price;
      p.netNoDiscount = p.quantity * p.price;
      sumPositionsNoDiscount += p.net;
      if (p.discount > 0) {
        p.net -= (p.net / 100) * p.discount;
      }
      if (this.data.taxOption?.applicable) {
        p.taxPrice = (p.net / 100) * p.tax;
      } else {
        p.taxPrice = 0;
      }
      p.total = p.net + p.taxPrice;
      if (sumPositions === 0 || p.net === 0) {
        p.totalPercentage = 0;
      } else {
        p.totalPercentage = (100 / sumPositions) * p.net;
      }
      return p;
    });
    this.data.netNoDiscount = sumPositionsNoDiscount;
    let sumDiscountsCharges = 0;
    this.data.discountsCharges.forEach((dc) => {
      const v =
        dc.valueType === "percent"
          ? (sumPositions / 100) * dc.value
          : Number(dc.value);

      dc.amount = v;
      if (dc.title != "" && dc.value > 0) {
        if (dc.type === "discount") {
          sumDiscountsCharges -= v;
        } else {
          sumDiscountsCharges += v;
        }
      }
    });

    this.data.positions.map((p) => {
      p.net += (sumDiscountsCharges / 100) * p.totalPercentage;
      if (this.data.taxOption?.applicable) {
        p.taxPrice = (p.net / 100) * p.tax;
      } else {
        p.taxPrice = 0;
      }
      p.total = p.net + p.taxPrice;
    });
  };

  setStatus(status: string) {
    this.status = status;
  }

  calcTotal() {
    this.data.total = 0;
    this.data.total += Math.round(this.data.net * 100) / 100;
    if (this.data.taxOption?.applicable) {
      Object.keys(this.data.taxes).map((k) => {
        this.data.total += Math.round(this.data.taxes[k] * 100) / 100;
      });
    }
  }

  calcNet() {
    this.data.net = 0;
    this.data.net = this.data.positions.reduce((p, c) => (p += c.net), 0);
  }

  calcTaxes() {
    this.data.taxes = {};
    if (this.data.taxOption?.applicable) {
      const rates: { [_: number]: number } = {};
      this.data.positions.forEach((p) => {
        if (!rates[p.tax]) {
          rates[p.tax] = 0;
        }
        rates[p.tax] += p.taxPrice;
      });
      this.data.taxes = rates;
    }
  }

  addPosition(
    pos: Position = {
      id: Date.now(),
      title: "",
      text: null,
      quantity: null,
      unit: null,
      price: null,
      tax: null,
      taxPrice: null,
      discount: null,
      netNoDiscount: null,
      net: null,
      total: null,
      focused: false,
      totalPercentage: null,
    },
  ) {
    this.data.positions.push({ ...pos });
  }

  removePosition(index: number) {
    this.data.positions.splice(index, 1);

    if (this.data.positions.length === 0) {
      this.addPosition();
    }
  }

  removePositions() {
    this.data.positions.splice(0, this.data.positions.length);
  }

  removeDiscountCharge(index: number) {
    this.data.discountsCharges.splice(index, 1);
  }

  addDiscountCharge(
    d: DiscountCharge = {
      id: Date.now().toString(),
      title: "",
      value: null,
      type: "discount",
      valueType: "percent",
      amount: 0,
    },
  ) {
    this.data.discountsCharges.push(d);
  }

  focusPosition(index: number) {
    this.data.positions.map((p) => (p.focused = false));
    this.data.positions[index].focused = true;
  }

  toJSON() {
    return { ...this };
  }
}

export { Document, Recurring };

import { Client, type ClientType } from "~~/models/client";
import { Document, Recurring } from "~~/models/document";
import Helpers from "@repo/common/Helpers";

import * as dateFns from "date-fns";
import _ from "lodash";
import type { Template } from "~/models/template";
import Base from "./_base";

class DocumentStore extends Base<Document> {
  clients = ref<Client[]>([]);
  templates = ref<Template[]>([]);
  mustSave = ref(-1);
  offerToConvert = ref(new Document());
  reminderInvoice = ref(new Document());
  recurring = ref(new Recurring());
  parentList = this.list;

  setTemplate = (id: string) => {
    this.item.value.templateId = id;
  };

  setClient = (client: ClientType) => {
    this.item.value.clientId = client.id;
    this.item.value.client = client;
    if (client.data.conditions.discount.value > 0) {
      client.data.conditions.discount.value,
        client.data.conditions.discount.valueType,
        this.item.value.addDiscountCharge({
          id: Date.now().toString(),
          title: "Client discount",
          type: "discount",
          value: client.data.conditions.discount.value,
          valueType: client.data.conditions.discount.valueType,
          amount: 0,
        });
    }
    if (this.item.value.data.positions[0].price === null && this.item.value.data.positions[0].quantity === null) {
      this.item.value.removePosition(0);
    }
    this.item.value.rebuild();
  };

  offerToInvoice = (offer: Document) => {};

  listForClient = (id: string) => {
    this.filter("clientId", "=", id);
    this.list();
  };

  setStatus = (d: Document) => {
    const status = d.status === "pending" ? (d.type === "invoice" ? "paid" : "accepted") : "pending";
    d.setStatus(status);
    useApi().documents(this.singularType()).setStatus(d.id, status);
  };

  list = async () => {
    this.getAllFunc = useApi().documents(this.singularType()).getAll;
    this.parentList();
  };

  save = async () => {
    // super.save();
    const ioo = await useApi().documents(this.singularType()).saveOrUpdate(this.item.value, !this.isNew());
    if (this.isNew()) {
      useRouter().replace(`/${this.type()}/${ioo.id}`);
    }
    this.mustSave.value = 0;
  };

  preview = async () => {
    return (await useRender(this.item.value, true)) as string[];
  };

  download = async (io?: Document) => {
    const dio = io || this.item.value;
    const data = (await useRender(dio)) as string;
    let a = document.createElement("a");
    a.href = data;
    a.download = dio!.number + ".pdf";
    a.click();
  };

  updated = () => {
    console.log("updated");
    this.item.value.rebuild();
    this.mustSave.value++;
  };

  duplicate = async (id: string) => {
    this.loading.value = true;
    const duplicate = await useApi().documents(this.singularType()).duplicate(id);
    useRouter().push(`/${this.type()}/${duplicate.id}`);
    this.loading.value = false;
  };

  handleReminder = async () => {
    this.reminderInvoice.value = await useApi()
      .documents("invoice")
      .get(useRoute().query.invoice as string);
    this.item.value.data.positions[0] = {
      net: this.reminderInvoice.value.data.total,
      tax: 0,
      text: "",
      unit: "",
      price: this.reminderInvoice.value.data.total,
      title: this.reminderInvoice.value.number,
      total: this.reminderInvoice.value.data.total,
      quantity: 1,
      totalPercentage: 100,
    };
    if (useSettings().settings.reminders.fees.length > 0) {
      for (const fee of useSettings().settings.reminders.fees) {
        this.item.value.data.discountsCharges.push(fee);
      }
    } else {
      this.item.value.data.discountsCharges.push({
        title: "Reminder fee",
        value: 5,
        type: "charge",
        valueType: "fixed",
        amount: 0,
      });
    }
    this.item.value.clientId = this.reminderInvoice.value.clientId;
    this.item.value.client = this.reminderInvoice.value.client;
    this.item.value.invoiceId = this.reminderInvoice.value.id;
    this.item.value.data.taxOption = {};
    this.item.value.calculate();
  };

  handleNew = async () => {
    console.log(useProfile().me.organization.settings[this.type()].dueDays);
    this.recurring.value = new Recurring();
    this.item.value.number = await useApi().number(this.singularType()).get();
    this.item.value.data.dueDate = dateFns.add(this.item.value.data.date, {
      days: useProfile().me.organization.settings[this.type()].dueDays,
    });

    if (this.type() === "reminders") {
      this.handleReminder();
    } else {
      await this.maybeDoConvertOffer();
    }
  };

  form = async () => {
    this.loading.value = true;
    this.clients.value = (await useApi().clients().getAll()).rows;
    this.templates.value = (await useApi().templates().getAll()).rows;
    const id = useRoute().params["id"] as string;

    this.item.value = new Document();
    this.item.value.type = this.singularType();
    if (this.isNew()) {
      this.handleNew();
    } else {
      this.item.value = Helpers.merge<Document>(this.item.value, await useApi().documents(this.singularType()).get(id));
      if (this.item.value.recurringInvoice) {
        this.recurring.value = this.item.value.recurringInvoice;
      } else {
        this.recurring.value = new Recurring();
      }
    }

    this.item.value.rebuild();
    if (!this.item.value.data.taxOption) {
      this.item.value.data.taxOption = useSettings().settings.taxes.options.filter((o) => o.default)[0];
    }
    this.mustSave.value = -1;
    this.loading.value = false;
  };

  del = async () => {
    await useApi().documents("invoice-or-offer").delete(this.item.value.id);
    useRouter().replace(`/${this.type()}/`);
  };

  maybeDoConvertOffer = async () => {
    if (useRoute().query.offer) {
      _.mergeWith(
        this.offerToConvert.value,
        await useApi()
          .documents("offer")
          .get(useRoute().query.offer as string),
      );
      this.item.value.removePositions();
      this.offerToConvert.value.rebuild();
      this.item.value.client = this.offerToConvert.value.client;
      this.item.value.clientId = this.offerToConvert.value.clientId;
      this.item.value.offerId = this.offerToConvert.value.id;
      if (useRoute().query.option === "partial") {
        this.offerToConvert.value.data.positions.map((p) => {
          if (useRoute().query.valueType === "percent") p.price = (p.price / 100) * Number(useRoute().query.value);
          if (useRoute().query.valueType === "fixed") p.price = ((Number(useRoute().query.value) / 100) * p.totalPercentage) / p.quantity;
          p.price = Math.round(p.price * 100) / 100;
          this.item.value.addPosition(p);
        });
      }
      if (useRoute().query.option === "final") {
        const previousNet = this.offerToConvert.value.invoices.reduce((p, c) => p + c.data.net, 0);
        const newNet = this.offerToConvert.value.data.net - previousNet;
        this.offerToConvert.value.data.positions.map((p) => {
          p.price = ((newNet / 100) * p.totalPercentage) / p.quantity;
          p.price = Math.round(p.price * 100) / 100;
          this.item.value.addPosition(p);
        });
      }

      if (["full", "final"].includes(useRoute().query.option as string)) {
        this.offerToConvert.value.data.discountsCharges.map((d) => {
          this.item.value.addDiscountCharge(d);
        });
      }
      this.item.value.invoices = this.offerToConvert.value.invoices;
      this.item.value.rebuild();
    } else {
      _.mergeWith(this.offerToConvert.value, new Document());
    }
  };
}

export default defineStore("document", () => new DocumentStore(ref(new Document()), useApi().documents("invoice").getAll));

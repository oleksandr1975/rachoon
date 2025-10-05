import Format from "@repo/common/Format";
import { Client } from "~~/models/client";
import { Document } from "~~/models/document";

export default defineStore("example", () => {
  const client = new Client();
  client.name = "Example client";
  client.data = {
    info: {
      vat: "XX-12345",
      addition: "",
    },
    contactPerson: {
      fullName: "Someone Somebody",
      email: "foo@example.com",
    },
    address: {
      street: "example",
      zip: "1234",
      city: "Somewhere",
      country: "Somewhere",
    },
    conditions: {
      rate: 60,
      discount: { value: 0, valueType: "" },
      earlyPayment: {
        days: 0,
        discount: 0,
      },
      invoiceDueDays: 0,
    },
  };
  const invoice = new Document();
  invoice.type = "invoice";
  invoice.data.positions = [
    {
      title: "Lorem ipsum dolor sit amet",
      text: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>",
      quantity: 5,
      price: 300,
      tax: 20,
      unit: "hrs",
    },
    {
      title: "Lorem ipsum dolor sit amet",
      text: "<p>Lorem ipsum dolor sit amet, consectetuer</p>",
      quantity: 10,
      price: 10000,
      tax: 20,
      unit: "hrs",
    },
  ];
  invoice.data.taxOption = {
    title: "Apply taxes",
    applicable: true,
    default: true,
  };
  invoice.data.discountsCharges = [
    {
      title: "Some discount",
      value: 5,
      type: "discount",
      valueType: "percent",
      amount: 10,
    },
  ];

  invoice.client = client;
  invoice.calculate();

  const offer = new Document();
  offer.type = "offer";
  offer.data.positions = [
    {
      title: "Lorem ipsum dolor sit amet",
      text: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>",
      quantity: 5,
      price: 300,
      tax: 20,
      unit: "hrs",
    },
    {
      title: "Lorem ipsum dolor sit amet",
      text: "<p>Lorem ipsum dolor sit amet, consectetuer</p>",
      quantity: 10,
      price: 10000,
      tax: 20,
      unit: "hrs",
    },
  ];
  offer.data.taxOption = {
    title: "Apply taxes",
    applicable: true,
    default: true,
  };
  offer.data.discountsCharges = [
    {
      title: "Some discount",
      value: 5,
      type: "discount",
      valueType: "percent",
      amount: 10,
    },
  ];

  offer.client = client;
  offer.calculate();

  async function preview(example: string, templateId: string = "") {
    invoice.number = Format.number(useSettings().settings.invoices.number, 0);
    offer.number = Format.number(useSettings().settings.offers.number, 0);

    const object = example === "invoice" ? invoice : offer;

    return (await useRender(object, true, templateId)) as string[];
  }

  return { invoice, offer, preview };
});

import { Dashboard } from "~~/models/dashboard";
import { Client, type ClientType } from "~~/models/client";
import { Document, type DocumentType } from "~~/models/document";
import { type OrganizationType } from "~~/models/organization";
import { User, type UserType } from "~~/models/user";
import { Template, type TemplateType } from "~/models/template";
import Paginator from "~/models/paginator";

export type getAllFunc<T> = (page: number, perPage: number, sort?: any, filter?: any) => Promise<Paginator<T>>;

export default function useApi() {
  const paginate = async <T>(url: string, Model: new (data: any) => T) => {
    const { body, headers } = await useHttp.get(url);
    const data = body.map((d: any) => new Model(d));

    return new Paginator<T>({
      total: Number(headers?.get("x-total") || "0"),
      perPage: Number(headers?.get("x-per-page") || "0"),
      page: Number(headers?.get("x-page") || "0"),
      pages: Number(headers?.get("x-pages") || "0"),
      rows: data,
    });
  };

  const parseSort = (sort?: any): string => {
    if (!sort) return "";
    const sorts: string[] = [];

    Object.keys(sort).forEach((key) => {
      sorts.push(`sort[${key}]=${sort[key]}`);
    });
    return `&${sorts.join("&")}`;
  };

  const parseFilter = (filter?: any): string => {
    if (!filter) return "";
    const filters: string[] = [];
    Object.keys(filter).forEach((key) => {
      const op = filter[key].operator.replace("=", "%3D");
      filters.push(`filter[${key}][${op}]=${filter[key].value}`);
    });
    return filters.join("&");
  };

  return {
    clients: (endpoint: string = "/api/clients") => {
      return {
        get: async (id: string): Promise<Client> => new Client((await useHttp.get(`${endpoint}/${id}`)).body!),
        getAll: async (page: number = 1, perPage: number = 5, sort?: any, filter?: any): Promise<Paginator<Client>> =>
          await paginate<Client>(`${endpoint}?page=${page}&perPage=${perPage}${parseSort(sort)}&${parseFilter(filter)}`, Client),
        count: async (): Promise<number> => Number((await useHttp.get(`${endpoint}/?count=true`)).body!),
        delete: async (id: string) => (await useHttp.del(`${endpoint}/${id}`)).body,
        saveOrUpdate: async (client: ClientType, update: boolean = false) => {
          const notif = {
            title: client.number,
            text: "Client saved successfully",
            type: "success",
          };
          if (update) {
            return (await useHttp.put(`${endpoint}/${client.id}`, client, notif)).body;
          } else {
            return (await useHttp.post(`${endpoint}`, client, notif)).body as ClientType;
          }
        },
      };
    },

    number: (type: string, endpoint: string = "/api/number") => {
      return {
        get: async (): Promise<string> => (await useHttp.get(`${endpoint}/${type}`)).body,
      };
    },

    templates: (endpoint: string = "/api/templates") => {
      return {
        get: async (id: string): Promise<TemplateType> => new Template((await useHttp.get(`${endpoint}/${id}`)).body),
        duplicate: async (id: string): Promise<TemplateType> => (await useHttp.get(`${endpoint}/duplicate/${id}`)).body as TemplateType,
        getDefault: async (): Promise<Template> => new Template((await useHttp.get(`${endpoint}/default`)).body),
        getAll: async (page: number = 1, perPage: number = 5, sort?: any, filter?: any): Promise<Paginator<Template>> =>
          await paginate<Template>(`${endpoint}?page=${page}&perPage=${perPage}&${parseSort(sort)}&${parseFilter(filter)}`, Template),

        // getAll: async (): Promise<Template[]> => ((await useHttp.get(`${endpoint}`)).body as []).map((d) => new Template(d)),
        delete: async (id: string) => (await useHttp.del(`${endpoint}/${id}`)).body,
        saveOrUpdate: async (template: TemplateType, update: boolean = false) => {
          const notif = {
            title: template.title,
            text: "Template saved successfully",
            type: "success",
          };
          if (update) {
            return (await useHttp.put(`${endpoint}/${template.id}`, template, notif)).body;
          } else {
            return (await useHttp.post(`${endpoint}`, template, notif)).body as TemplateType;
          }
        },
      };
    },

    users: (endpoint: string = "/api/users") => {
      return {
        get: async (id: string): Promise<UserType> => (await useHttp.get(`${endpoint}/${id}`)).body as UserType,
        // getAll: async (): Promise<User[]> => ((await useHttp.get(`${endpoint}`)).body as []).map((d) => new User(d)),
        getAll: async (page: number = 1, perPage: number = 5, sort?: any, filter?: any): Promise<Paginator<User>> =>
          await paginate<User>(`${endpoint}?page=${page}&perPage=${perPage}&${parseSort(sort)}&${parseFilter(filter)}`, User),

        delete: async (id: string) => (await useHttp.del(`${endpoint}/${id}`)).body,
        saveOrUpdate: async (user: UserType, update: boolean = false) => {
          const notif = {
            title: user.data.fullName,
            text: "User saved successfully",
            type: "success",
          };
          if (update) {
            return (await useHttp.put(`${endpoint}/${user.id}`, user, notif)).body;
          } else {
            return (await useHttp.post(`${endpoint}`, user, notif)).body as UserType;
          }
        },
      };
    },

    documents: (type: string, endpoint: string = "/api/documents") => {
      return {
        saveOrUpdate: async (document: DocumentType, update: boolean = false): Promise<DocumentType> => {
          if (update) {
            await useHttp.put(`${endpoint}/${document.id}`, document, {
              title: `${type} ${document.number}`,
              text: "Successfully updated",
            });
            return document;
          } else {
            return (
              await useHttp.post(`${endpoint}?type=${type}`, document, {
                title: document.number,
                text: `${type} saved successfully`,
                type: "success",
              })
            ).body as DocumentType;
          }
        },
        getAll: async (page: number = 1, perPage: number = 5, sort?: any, filter?: any): Promise<Paginator<Document>> =>
          await paginate<Document>(
            `${endpoint}?type=${type}&page=${page}&perPage=${perPage}&${parseSort(sort)}&${parseFilter(filter)}`,
            Document,
          ),

        get: async (id: string): Promise<Document> => new Document((await useHttp.get(`${endpoint}/${id}`)).body),
        duplicate: async (id: string): Promise<Document> => (await useHttp.get(`${endpoint}/duplicate/${id}`)).body,
        delete: async (id: string) => (await useHttp.del(`${endpoint}/${id}`)).body,
        count: async (): Promise<number> => Number((await useHttp.get(`${endpoint}/?count=true&type=${type}`)).body),
        setStatus: async (id: string, status: string) =>
          await useHttp.put(
            `/api/documents/status/${id}`,
            { status: status },
            {
              title: "Status changed",
              text: "Successfully marked as " + status,
            },
          ),
      };
    },
    organization: (endpoint: string = "/api/organizations") => {
      return {
        getCurrent: async () => (await useHttp.get("/")).body,
        save: async (organization: OrganizationType) =>
          await useHttp.post(endpoint, organization, {
            title: "Settings",
            text: "Successfully saved",
            type: "success",
          }),
      };
    },
    profile: (endpoint: string = "/api/profile") => {
      return {
        get: async () => new User((await useHttp.get(endpoint)).body),
        save: async (user: UserType) =>
          useHttp.post(endpoint, user, {
            title: "Save profile",
            text: "Profile saved successfully",
          }),
        savePassword: async (password: string) =>
          useHttp.post(
            `${endpoint}?pwOnly=true`,
            { password: password },
            {
              title: "Save password",
              text: "Password saved successfully",
              type: "success",
            },
          ),
      };
    },
    dashboard: () => {
      return {
        get: async () => new Dashboard((await useHttp.get("/api/dashboard")).body),
      };
    },
    render: async (html: string, preview: boolean = false): Promise<string[] | string> => {
      const res = (await useHttp.post(`/api/render${preview ? "?preview=true" : ""}`, {
        html: html,
      })) as string[];

      if (preview) return res;

      return res[0];
    },
  };
}

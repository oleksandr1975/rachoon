export default async function useRender(object: any, preview: boolean = false, tpl: string = ""): Promise<string | string[]> {
  if (object.templateId && object.templateId !== "") {
    tpl = object.templateId;
  }
  let template = useTemplate().defaultTemplate;
  if (tpl !== "" && tpl !== "null") {
    template = await useApi().templates().get(tpl);
  }

  return (
    await useHttp.post(`/api/render${preview ? "?preview=true" : ""}`, {
      templateId: template.id,
      data: object,
    })
  ).body;
}

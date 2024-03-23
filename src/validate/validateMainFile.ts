import { Frameworks, Languages } from "../types";

const fields = [
  { name: "name", required: true, type: "string" },
  {
    name: "externalModules",
    required: false,
    type: "object",
  },
  { name: "microservices", required: true, type: "object" },
];

export const validateFile = (fileContent: any) => {
  for (const field of fields) {
    if (!fileContent[field.name] && field.required) {
      throw new Error(`Field ${field.name} is required`);
    }
    if (typeof fileContent[field.name] !== field.type) {
      throw new Error(`Field ${field.name} should be ${field.type}`);
    }
  }

  for (const micro of fileContent.microservices) {
    if (
      micro.framework === Frameworks.NEST &&
      micro.language === Languages.JS
    ) {
      throw new Error(
        `Language ${micro.language} is not applicable for framework ${micro.framework} config`
      );
    }
  }
};

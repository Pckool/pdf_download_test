import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

export {}
export type TableData = Record<string, string | number>

export function parseLookAheadData<T = any>(data: any[]): Record<string, any>[] {
  return data
    .map((d) => {
      const milestoneData = d.recentMilestones.map((m: any) => {
        return {
          projectName: d.projectName,
          phaseName: d.phaseName,
          completionDate: d.completionDate,
          totalDelay: d.totalDelay,
          ...m
        };
      });
      return milestoneData;
    })
    .flat();
};

export const parseToPdfData = (data: TableData[]): (string | number)[][] => {
  return data.map((d) => {
    const status = d.status === "IP" ? "In Progress" : "Not Started";
    return [
      d.projectName,
      d.phaseName,
      d.name,
      d.baselineDate,
      status,
      d.plannedDate,
      d.completionDate,
      d.totalDelay
    ];
  });
};

export const headers = [
  "Project",
  "Project Phase",
  "Recent Milestone",
  "Baseline",
  "Status",
  "Planned",
  "Completion",
  "Total Delay"
];

export const docDefinitionDefault: TDocumentDefinitions = {
  pageSize: "A4",
  pageOrientation: "landscape",
  pageMargins: [40, 60, 40, 60],
  content: [
    {
      text: "Look Ahead Table",
      style: "header",
      alignment: "center"
    },
    {
      text:
        "Input your description here, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      style: "textBody",
      alignment: "justify"
    },
    {
      layout: "lightHorizontalLines",
      style: "withMargin",
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: ["*", "auto", 100, "*", "*", "*", "*", "*"],

        body: [
          [],
          ["Value 1", "Value 2", "Value 3", "Value 4", "", "", "", ""],
          [
            { text: "Bold value" },
            "Val 2",
            "Val 3",
            "Val 4",
            "",
            "",
            "",
            ""
          ]
        ]
      }
    }
  ],
  defaultStyle: {
    font: "NimbusSans",

  },
  styles: {
    withMargin: {
      margin: [20, 20, 20, 20]
    },
    alignCenter: {
      alignment: "center"
    },
    header: {
      fontSize: 18,
      // bold: true
    },
    textBody: {
      fontSize: 12
    },
    subheader: {
      fontSize: 15,
      bold: true
    },
    quote: {
      italics: true
    },
    small: {
      fontSize: 8
    }
  }
};


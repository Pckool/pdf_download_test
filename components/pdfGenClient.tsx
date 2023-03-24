'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import * as pdfMake from "pdfmake/build/pdfmake";
import html2canvas from "html2canvas";
// import 'pdfmake/build/vfs_fonts'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import vfs from '../fonts/vfs_fonts'
import { lookAheadData } from "../assets/test-data";
import { ContentImage, ContentTable, TDocumentDefinitions } from "pdfmake/interfaces";
import { toast } from 'sonner'
import { docDefinitionDefault, headers, parseLookAheadData, parseToPdfData, TableData } from "@/utils/helpers";
// @ts-ignore
pdfMake.vfs = vfs;
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
pdfMake.fonts = {
    NimbusSans: {
      normal: "NimbusSanL-Reg.otf",
      bold: "NimbusSanL-Bol.otf",

      italics: "NimbusSanL-RegIta.otf",
      bolditalics: "NimbusSanL-BolIta.otf"
    },
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};



export default function PDFGenClient() {
  const [data, setData] = useState<TableData[]>([]);
  const [pdfData, setPdfData] = useState<any[][]>([]);
  const [docDefinition, setDocDefinition] = useState<TDocumentDefinitions>();

  const tableRef = useRef<HTMLDivElement>(null)
  // called to update the docDefinition
  const setTableBodyData = () => {
    try {

      const currentContent = docDefinitionDefault.content
      if (!Array.isArray(currentContent)) {
        return
      }


      (currentContent[2] as ContentTable).table.body = [headers, ...pdfData];

      const template: TDocumentDefinitions = {
        ...docDefinitionDefault, content: [
          ...currentContent
        ]
      };

      setDocDefinition(template);
    } catch (err) {
      console.log(err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  };

  useEffect(() => {
    const parsed = parseLookAheadData(lookAheadData.tableData);
    const pdfData = parseToPdfData(parsed);
    setPdfData(pdfData);
    setData(parsed);
  }, []);

  // if the data changes, update the docDefinition
  useEffect(() => {
    setTableBodyData();
  }, [data]);

  const create = () => {

    console.log('ran ')
    if (!docDefinition) {
      return toast(`couldn't find a doc definition`)
    }
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.download();
    } catch (err) {
      console.error(err)
      toast.error(`error generating pdf`)
    }
  };

  const genPdf = async () => {
    //get table html
    const pdfTable = tableRef.current;
    if (!pdfTable) {
      return toast(`couldn't find a table to embed`)
    }
    if (!docDefinition) {
      return toast(`couldn't find a doc definition`)
    }
    try {
      const canvas = await html2canvas(pdfTable)
      const imgObj: ContentImage = {
        image: canvas.toDataURL("image/png"),
        width: 600,
        style: {
          alignment: "center"
        }
      };
      const documentDefinition: TDocumentDefinitions = {
        content: [imgObj],
        defaultStyle: {
          font: "NimbusSans"
        },
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [40, 60, 40, 60]
      };
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.download();

    } catch (err) {
      console.error(err)
      toast.error(`error generating pdf`)
    }

  };

  return (
    <div className="">
      <h2>Start editing to see some magic!</h2>
      <button onClick={create}>Generate PDF using PDF Make (HTML embed)</button>
      <h1>Hello CodeSandbox</h1>


      <>
        <div ref={tableRef}>
          <table>
            <thead>

              <tr>
                {headers.map((h, i) => {
                  return <th key={`${h}-${i}`}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const status =
                  d.status === "IP" ? "In Progress" : "Not Started";

                return (
                  <tr key={`${d.projectName}_${i}`}>
                    <td>{d.projectName}</td>
                    <td>{d.phaseName}</td>
                    <td>{d.name}</td>
                    <td>{d.baselineDate}</td>
                    <td>
                      <div className="status-chip">{status}</div>
                    </td>
                    <td>{d.plannedDate}</td>
                    <td>{d.completionDate}</td>
                    <td>{d.totalDelay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
      <button onClick={genPdf}>
        Generate PDF for Table with PDFMake (image embed + styles)
      </button>
    </div>
  );
}

import type { TableProps } from "@src/ui/components/designSystem/table.types";

export function Table<Row>({ columns, getRowKey, rows }: TableProps<Row>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-[#181818] [scrollbar-color:rgba(255,255,255,0.28)_transparent]">
      <table className="w-full min-w-[48rem] border-collapse text-left lg:min-w-full">
        <thead className="border-b border-white/[0.06] bg-[#141414]">
          <tr>
            {columns.map((column) => (
              <th
                className="px-5 py-2 text-sm font-bold text-white/55 first:pl-6 last:pr-6"
                key={column.id}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <tr className="bg-[#1d1d1d]" key={getRowKey(row)}>
              {columns.map((column) => (
                <td
                  className="px-5 py-3 align-middle first:pl-6 last:pr-6"
                  key={column.id}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

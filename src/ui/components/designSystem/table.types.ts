import type { ReactNode } from "react";

export type TableColumn<Row> = {
  id: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
};

export type TableProps<Row> = {
  columns: TableColumn<Row>[];
  getRowKey: (row: Row) => string;
  rows: Row[];
};

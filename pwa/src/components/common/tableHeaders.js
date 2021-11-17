import * as React from "react";

export default function TableHeaders({headerItems}) {

  const tableHeaders = headerItems.map((item) =>
    <th scope="col">{item.name}</th>
  )

  return (
    <thead>
    <tr>
      {
        tableHeaders
      }
    </tr>
    </thead>
  );
}

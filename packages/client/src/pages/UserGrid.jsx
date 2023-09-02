import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import useGetUsers from '../hooks/useGetUsers';
import moment from 'moment';
const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'username', headerName: 'Username', width: 150 },
  {
    field: 'start', headerName: 'Start', width: 150, valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }
      return `${moment(params.value).format("MMM Do YY")}`;
    },
  },
  { field: 'delta', headerName: 'Delta', width: 150 },
  { field: 'quota', headerName: 'Quota', width: 150 },
];
function UserGrid(props) {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [rowCountState, setRowCountState] = useState(0);
  const [rows, setRows] = useState([]);
  const [status, getUsers] = useGetUsers();
  const updateGrid = async ({ pageSize, page }) => {
    const offset = page ? page * pageSize : 0;
    const { data: { users, total } } = await getUsers(offset, pageSize);
    setRows(users);
    setRowCountState(total);
    setPaginationModel({ pageSize, page });
  }
  useEffect(() => {
    updateGrid({ pageSize: 5, page: 0 });
  }, [])
  return (
    <div style={{ height: 500, padding: "24px" }}>
      <DataGrid rowHeight={25}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={updateGrid}
        rowCount={rowCountState}
        // checkboxSelection
        paginationMode="server"
        loading={status === "loading"}
        pageSizeOptions={[5, 10, 25]}
      // autoPageSize

      />
    </div>
  )
}
export function Component() {
  return UserGrid();
}
Component.displayName = "UserGrid";

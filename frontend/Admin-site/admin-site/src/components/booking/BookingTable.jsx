import React from "react";
import Box from "@mui/material/Box";

import { DataGrid } from "@mui/x-data-grid";

import Loading from "../common/Loading";






export default function BookingTable({ booking, isLoading, errorMsg }) {
  // const navigate = useNavigate()

    

const columns = [
  { field: "id", headerName: "Booking ID", width: 110 },
  { field: "user_id", headerName: "User ID", width: 100 },
  { field: "user_name", headerName: "User Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "property_id", headerName: "Property ID", width: 120 },
  { field: "property_name", headerName: "Property Name", width: 230 },
  {
    field: "check_in",
    headerName: "Check In",
    width: 130,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleDateString("en-IN") : "-",
  },
  {
    field: "check_out",
    headerName: "Check Out",
    width: 130,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleDateString("en-IN") : "-",
  },
  {
    field: "total_amount",
    headerName: "Total Amount",
    width: 140,
    valueFormatter: (value) =>
      value != null ? `₹${value.toLocaleString("en-IN")}` : "-",
  },
  {
    field: "status",
    headerName: "Booking Status",
    width: 150,
  },
];
  return (
    <Box
      sx={{
        height: 550,
        width: "100%",

        // =========================
        // MAIN DATAGRID
        // =========================
        "& .MuiDataGrid-root": {
          border: "1px solid #2A2A40",
          backgroundColor: "#16213E",
          color: "#FFFFFF",

          // IMPORTANT
          "--DataGrid-t-color": "#FFFFFF",
          "--DataGrid-pinnedBackground": "#16213E",
          "--DataGrid-containerBackground": "#16213E",
          "--DataGrid-headerBackground": "#1A1A2E",
        },

        // =========================
        // TOOLBAR
        // =========================

        "& .MuiDataGrid-toolbar": {
          backgroundColor: "#16213E !important",
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-toolbar *": {
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-toolbar button": {
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-toolbar button svg": {
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-toolbar .MuiIconButton-root": {
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-toolbar .MuiIconButton-root svg": {
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-toolbarContainer button:hover svg": {
          filter: "brightness(0) invert(1)",
        },
        // =========================
        // COLUMN HEADER
        // =========================
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#1A1A2E !important",
          color: "#FFFFFF !important",
          borderBottom: "1px solid #2A2A40",
        },

        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#1A1A2E !important",
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-columnHeaderTitle": {
          color: "#FFFFFF !important",
          fontWeight: 600,
        },

        // Header icons
        "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
          color: "#A7A7B3 !important",
        },

        "& .MuiDataGrid-columnHeader .MuiIconButton-root": {
          color: "#A7A7B3 !important",
        },

        "& .MuiDataGrid-columnHeader .MuiIconButton-root:hover": {
          color: "#FFFFFF !important",
          backgroundColor: "#0F3460 !important",
        },

        // =========================
        // ROWS
        // =========================
        "& .MuiDataGrid-row": {
          backgroundColor: "#16213E",
          color: "#FFFFFF",
          borderBottom: "1px solid #2A2A40",
        },

        "& .MuiDataGrid-row:hover": {
          backgroundColor: "#0F3460 !important",
        },

        // Selected row
        "& .MuiDataGrid-row.Mui-selected": {
          backgroundColor: "#0F3460 !important",
        },

        "& .MuiDataGrid-row.Mui-selected:hover": {
          backgroundColor: "#0F3460 !important",
        },

        // =========================
        // CELLS
        // =========================
        "& .MuiDataGrid-cell": {
          color: "#FFFFFF !important",
          borderBottom: "1px solid #2A2A40",
        },

        // =========================
        // ACTIONS
        // =========================
        "& .MuiDataGrid-actionsCell": {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px",
          paddingLeft: "8px",
        },

        "& .MuiDataGrid-actionsCell .MuiIconButton-root": {
          color: "#FFFFFF !important",
        },

        "& .MuiDataGrid-actionsCell .MuiIconButton-root:hover": {
          backgroundColor: "#0F3460 !important",
        },

        // =========================
        // PAGINATION
        // =========================
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "#1A1A2E",
          borderTop: "1px solid #2A2A40",
        },

        "& .MuiTablePagination-root": {
          color: "#FFFFFF",
        },

        "& .MuiTablePagination-selectLabel": {
          color: "#A7A7B3",
        },

        "& .MuiTablePagination-displayedRows": {
          color: "#A7A7B3",
        },

        "& .MuiTablePagination-select": {
          color: "#FFFFFF",
        },

        "& .MuiTablePagination-actions .MuiIconButton-root": {
          color: "#FFFFFF",
        },

        "& .MuiTablePagination-actions .MuiIconButton-root:hover": {
          backgroundColor: "#0F3460",
        },

        // =========================
        // CHECKBOX
        // =========================
        "& .MuiCheckbox-root": {
          color: "#A7A7B3",
        },

        "& .MuiCheckbox-root.Mui-checked": {
          color: "#0F3460",
        },

        // =========================
        // SCROLLBAR
        // =========================
        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },

        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
          backgroundColor: "#0D0D0D",
        },

        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
          backgroundColor: "#0F3460",
          borderRadius: "10px",
        },

        "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#1A1A2E",
        },
       
      }}
    >
      {isLoading ? (
    <Loading text="Loading categories..." />
) : errorMsg ? (
    <div className="h-full flex items-center justify-center text-red-400">
        {errorMsg}
    </div>
) : (
    <DataGrid
        rows={booking || []}
        columns={columns}
        showToolbar
        
        // disableRowSelectionOnClick
        localeText={{
            noRowsLabel: "No booking found",
        }}
    />
)}
    </Box>
  );
}
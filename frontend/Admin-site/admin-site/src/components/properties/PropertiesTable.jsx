import React from "react";
import Box from "@mui/material/Box";
import { useDispatch } from 'react-redux'

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axiosNew from "../../utils/axiosNew";
import Loading from "../common/Loading";

import { fetchProperties } from "../../redux/action/properties.action";





export default function PropertiesTable({ properties, isLoading, errorMsg }) {
  // const navigate = useNavigate()

    const dispatch=useDispatch()
    const navigate = useNavigate()

 const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "name",
    headerName: "Property Name",
    width: 220,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cover_image",
    headerName: "Cover Image",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => {
      // API se cover_image ka path lekar complete image URL bana rahe hain
      const imageUrl = `${axiosNew.defaults.baseURL}${row.cover_image}`;

      return (
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={row.name}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      );
    },
  },
  {
    field: "category_id",
    headerName: "Category ID",
    width: 110,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "price_per_night",
    headerName: "Price / Night",
    width: 130,
    align: "center",
    headerAlign: "center",
    // Price ko Indian currency format mein show karenge
    valueFormatter: (value) =>
      `₹${Number(value).toLocaleString("en-IN")}`,
  },
  {
    field: "guest_capacity",
    headerName: "Guest Capacity",
    width: 130,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "is_active",
    headerName: "Status",
    width: 110,
    align: "center",
    headerAlign: "center",
    // Boolean value ko readable status mein show karenge
    valueFormatter: (value) => (value ? "Active" : "Inactive"),
  },
  {
    field: "images",
    headerName: "Total Images",
    width: 120,
    align: "center",
    headerAlign: "center",
    // Property ke total uploaded images count show karenge
    valueGetter: (value) => value?.length || 0,
  },
  {
    field: "description",
    headerName: "Description",
    width: 350,
    align: "left",
    headerAlign: "center",
  },
  {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      renderCell: ({ row: { id, name } }) => {
        return [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityIcon fontSize="small" />}
            label={`View ${name}`}
            className="admin-grid-action"
            onClick={() => navigate(`/single-properties/${id}`)}
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon fontSize="small" />}
            label={`Edit ${name}`}
            className="admin-grid-action"
            onClick={() => navigate(`/update-properties/${id}`)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon fontSize="small" />}
            label={`Delete ${name}`}
            className="admin-grid-action admin-grid-action-danger"
            onClick={() => {
              const confirmation = window.confirm(
                `Do you want to delete ${name} properties?`,
              );
              if (confirmation) {
                axiosNew
                  .delete(`/properties/${id}`)
                  .then(() => dispatch(fetchProperties()))
                  .catch((error) => console.error(error));
              }
            }}
          />,
        ];
      },
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
    <Loading text="Loading properties..." />
) : errorMsg ? (
    <div className="h-full flex items-center justify-center text-red-400">
        {errorMsg}
    </div>
) : (
    <DataGrid
        rows={properties || []}
        columns={columns}
        showToolbar
        // disableRowSelectionOnClick
        localeText={{
            noRowsLabel: "No properties found",
        }}
    />
)}
    </Box>
  );
}
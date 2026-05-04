export const getCommonStyles = (colors) => ({
  dataGrid: {
    "& .MuiDataGrid-root": { border: "none" },
    "& .MuiDataGrid-cell": { border: "none" },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: colors.blueAccent[700],
      borderBottom: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: colors.primary[400],
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: colors.blueAccent[700],
    },
  },

  filledInput: {
    "& .MuiFilledInput-root": {
      backgroundColor: colors.primary[400],
    },
    "& .MuiInputBase-input": {
      color: colors.gray[100],
    },
  },

  accordion: (theme, colors) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? colors.primary[400]
        : "#f5f5f5",
    borderRadius: 8,
  }),

  accordionHeader: (theme, colors) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? colors.primary[200]
        : "#e0e0e0",
  }),
});
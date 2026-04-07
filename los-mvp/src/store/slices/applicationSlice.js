import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllApplications, getApplicationById, createApplication, updateApplication } from '../../services/dataService';

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const applications = await getAllApplications();
      return applications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const application = await getApplicationById(id);
      return application;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addApplication = createAsyncThunk(
  'applications/add',
  async ({ applicationData, userId }, { rejectWithValue }) => {
    try {
      const application = await createApplication(applicationData, userId);
      return application;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const modifyApplication = createAsyncThunk(
  'applications/modify',
  async ({ id, updates, userId }, { rejectWithValue }) => {
    try {
      const application = await updateApplication(id, updates, userId);
      return application;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    currentApplication: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add application
      .addCase(addApplication.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.currentApplication = action.payload;
      })
      // Modify application
      .addCase(modifyApplication.fulfilled, (state, action) => {
        const index = state.list.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentApplication?.id === action.payload.id) {
          state.currentApplication = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;

// Made with Bob

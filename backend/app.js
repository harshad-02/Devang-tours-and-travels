import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/devang-travels";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
const inMemoryRequests = [];
const inMemoryPlannedTripRequests = [];
let isDatabaseConnected = false;

const rideRequestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    tripDate: {
      type: String,
      required: true,
      trim: true,
    },
    boardingTime: {
      type: String,
      required: true,
      trim: true,
    },
    addressMapLink: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

const plannedTripRequestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropLocation: {
      type: String,
      required: true,
      trim: true,
    },
    tripDate: {
      type: String,
      required: true,
      trim: true,
    },
    boardingTime: {
      type: String,
      required: true,
      trim: true,
    },
    addressMapLink: {
      type: String,
      default: "",
      trim: true,
    },
    tripSlug: {
      type: String,
      required: true,
      trim: true,
    },
    tripTitle: {
      type: String,
      required: true,
      trim: true,
    },
    tripDuration: {
      type: String,
      required: true,
      trim: true,
    },
    tripSummary: {
      type: String,
      required: true,
      trim: true,
    },
    tripRoute: {
      type: String,
      required: true,
      trim: true,
    },
    tripCoverage: {
      type: [String],
      default: [],
    },
    tripHighlights: {
      type: [String],
      default: [],
    },
    tripNotes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "planned_trip",
  },
);

const PlannedTripRequest = mongoose.model(
  "PlannedTripRequest",
  plannedTripRequestSchema,
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/requests", async (req, res) => {
  try {
    const customerName = req.body.customerName?.trim();
    const mobileNumber = req.body.mobileNumber?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const source = req.body.source?.trim();
    const destination = req.body.destination?.trim();
    const tripDate = req.body.tripDate?.trim();
    const boardingTime = req.body.boardingTime?.trim();
    const addressMapLink = req.body.addressMapLink?.trim() || "";

    if (
      !customerName ||
      !mobileNumber ||
      !email ||
      !source ||
      !destination ||
      !tripDate ||
      !boardingTime
    ) {
      return res.status(400).json({
        message:
          "Name, mobile number, email, source, destination, trip date, and boarding time are required.",
      });
    }

    const requestPayload = {
      customerName,
      mobileNumber,
      email,
      source,
      destination,
      tripDate,
      boardingTime,
      addressMapLink,
      status: "pending",
    };

    const rideRequest = isDatabaseConnected
      ? await RideRequest.create(requestPayload)
      : createInMemoryRequest(requestPayload);

    return res.status(201).json({
      message: "Trip request saved successfully.",
      request: rideRequest,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to save trip request right now.",
    });
  }
});

app.post("/api/planned-trip-requests", async (req, res) => {
  try {
    const customerName = req.body.customerName?.trim();
    const mobileNumber = req.body.mobileNumber?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const pickupLocation = req.body.pickupLocation?.trim();
    const dropLocation = req.body.dropLocation?.trim();
    const tripDate = req.body.tripDate?.trim();
    const boardingTime = req.body.boardingTime?.trim();
    const addressMapLink = req.body.addressMapLink?.trim() || "";
    const plannedTrip = req.body.plannedTrip || {};
    const tripSlug = plannedTrip.slug?.trim();
    const tripTitle = plannedTrip.title?.trim();
    const tripDuration = plannedTrip.duration?.trim();
    const tripSummary = plannedTrip.summary?.trim();
    const tripRoute = plannedTrip.route?.trim();
    const tripCoverage = Array.isArray(plannedTrip.coverage)
      ? plannedTrip.coverage
          .map((item) => `${item}`.trim())
          .filter(Boolean)
      : [];
    const tripHighlights = Array.isArray(plannedTrip.highlights)
      ? plannedTrip.highlights
          .map((item) => `${item}`.trim())
          .filter(Boolean)
      : [];
    const tripNotes = plannedTrip.notes?.trim() || "";

    if (
      !customerName ||
      !mobileNumber ||
      !email ||
      !pickupLocation ||
      !dropLocation ||
      !tripDate ||
      !boardingTime ||
      !tripSlug ||
      !tripTitle ||
      !tripDuration ||
      !tripSummary ||
      !tripRoute
    ) {
      return res.status(400).json({
        message:
          "Customer details, schedule, and selected planned trip information are required.",
      });
    }

    const requestPayload = {
      customerName,
      mobileNumber,
      email,
      pickupLocation,
      dropLocation,
      tripDate,
      boardingTime,
      addressMapLink,
      tripSlug,
      tripTitle,
      tripDuration,
      tripSummary,
      tripRoute,
      tripCoverage,
      tripHighlights,
      tripNotes,
      status: "pending",
    };

    const plannedTripRequest = isDatabaseConnected
      ? await PlannedTripRequest.create(requestPayload)
      : createInMemoryPlannedTripRequest(requestPayload);

    return res.status(201).json({
      message: "Planned trip request saved successfully.",
      request: plannedTripRequest,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to save planned trip request right now.",
    });
  }
});

app.get("/api/admin/requests", async (req, res) => {
  try {
    const providedPassword = req.headers["x-admin-password"];

    if (providedPassword !== adminPassword) {
      return res.status(401).json({
        message: "Invalid admin password.",
      });
    }

    const requests = isDatabaseConnected
      ? await RideRequest.find().sort({ createdAt: -1 }).lean()
      : [...inMemoryRequests].sort(compareCreatedAtDesc);

    return res.json({
      requests,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load requests right now.",
    });
  }
});

app.get("/api/admin/planned-trip-requests", async (req, res) => {
  try {
    const providedPassword = req.headers["x-admin-password"];

    if (providedPassword !== adminPassword) {
      return res.status(401).json({
        message: "Invalid admin password.",
      });
    }

    const requests = isDatabaseConnected
      ? await PlannedTripRequest.find().sort({ createdAt: -1 }).lean()
      : [...inMemoryPlannedTripRequests].sort(compareCreatedAtDesc);

    return res.json({
      requests,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load planned trip requests right now.",
    });
  }
});

app.patch("/api/admin/requests/:id/status", async (req, res) => {
  try {
    const providedPassword = req.headers["x-admin-password"];

    if (providedPassword !== adminPassword) {
      return res.status(401).json({
        message: "Invalid admin password.",
      });
    }

    const nextStatus = req.body.status?.trim();

    if (!["confirmed", "rejected"].includes(nextStatus)) {
      return res.status(400).json({
        message: "A valid request status is required.",
      });
    }

    const request = isDatabaseConnected
      ? await RideRequest.findByIdAndUpdate(
          req.params.id,
          { status: nextStatus },
          { new: true, runValidators: true },
        ).lean()
      : updateInMemoryRequestStatus(inMemoryRequests, req.params.id, nextStatus);

    if (!request) {
      return res.status(404).json({
        message: "Trip request not found.",
      });
    }

    return res.json({
      message: `Trip request ${nextStatus}.`,
      request,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update trip request right now.",
    });
  }
});

app.patch("/api/admin/planned-trip-requests/:id/status", async (req, res) => {
  try {
    const providedPassword = req.headers["x-admin-password"];

    if (providedPassword !== adminPassword) {
      return res.status(401).json({
        message: "Invalid admin password.",
      });
    }

    const nextStatus = req.body.status?.trim();

    if (!["confirmed", "rejected"].includes(nextStatus)) {
      return res.status(400).json({
        message: "A valid planned trip request status is required.",
      });
    }

    const request = isDatabaseConnected
      ? await PlannedTripRequest.findByIdAndUpdate(
          req.params.id,
          { status: nextStatus },
          { new: true, runValidators: true },
        ).lean()
      : updateInMemoryRequestStatus(inMemoryPlannedTripRequests, req.params.id, nextStatus);

    if (!request) {
      return res.status(404).json({
        message: "Planned trip request not found.",
      });
    }

    return res.json({
      message: `Planned trip request ${nextStatus}.`,
      request,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update planned trip request right now.",
    });
  }
});

app.delete("/api/admin/requests/:id", async (req, res) => {
  try {
    const providedPassword = req.headers["x-admin-password"];

    if (providedPassword !== adminPassword) {
      return res.status(401).json({
        message: "Invalid admin password.",
      });
    }

    const deletedRequest = isDatabaseConnected
      ? await RideRequest.findByIdAndDelete(req.params.id).lean()
      : deleteInMemoryRequest(inMemoryRequests, req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({
        message: "Trip request not found.",
      });
    }

    return res.json({
      message: "Trip marked as done and removed successfully.",
      request: deletedRequest,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to remove trip right now.",
    });
  }
});

app.delete("/api/admin/planned-trip-requests/:id", async (req, res) => {
  try {
    const providedPassword = req.headers["x-admin-password"];

    if (providedPassword !== adminPassword) {
      return res.status(401).json({
        message: "Invalid admin password.",
      });
    }

    const deletedRequest = isDatabaseConnected
      ? await PlannedTripRequest.findByIdAndDelete(req.params.id).lean()
      : deleteInMemoryRequest(inMemoryPlannedTripRequests, req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({
        message: "Planned trip request not found.",
      });
    }

    return res.json({
      message: "Planned trip marked as done and removed successfully.",
      request: deletedRequest,
      storage: isDatabaseConnected ? "mongodb" : "memory",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to remove planned trip right now.",
    });
  }
});

function createInMemoryRequest({
  customerName,
  mobileNumber,
  email,
  source,
  destination,
  tripDate,
  boardingTime,
  addressMapLink,
  status,
}) {
  const timestamp = new Date().toISOString();
  const request = {
    _id: new mongoose.Types.ObjectId().toString(),
    customerName,
    mobileNumber,
    email,
    source,
    destination,
    tripDate,
    boardingTime,
    addressMapLink,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  inMemoryRequests.push(request);
  return request;
}

function createInMemoryPlannedTripRequest(payload) {
  const timestamp = new Date().toISOString();
  const request = {
    _id: new mongoose.Types.ObjectId().toString(),
    ...payload,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  inMemoryPlannedTripRequests.push(request);
  return request;
}

function updateInMemoryRequestStatus(requestStore, requestId, nextStatus) {
  const request = requestStore.find(({ _id }) => _id === requestId);

  if (!request) {
    return null;
  }

  request.status = nextStatus;
  request.updatedAt = new Date().toISOString();
  return request;
}

function deleteInMemoryRequest(requestStore, requestId) {
  const requestIndex = requestStore.findIndex(({ _id }) => _id === requestId);

  if (requestIndex === -1) {
    return null;
  }

  const [deletedRequest] = requestStore.splice(requestIndex, 1);
  return deletedRequest;
}

function compareCreatedAtDesc(firstRequest, secondRequest) {
  return (
    new Date(secondRequest.createdAt).getTime() -
    new Date(firstRequest.createdAt).getTime()
  );
}

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    isDatabaseConnected = true;
    console.log(`MongoDB connected at ${mongoUri}`);
  } catch (error) {
    isDatabaseConnected = false;
    console.warn(
      `MongoDB unavailable at ${mongoUri}. Starting with in-memory storage instead.`,
    );
    console.warn(error.message);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();

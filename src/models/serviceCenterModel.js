import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const serviceCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    owner: {
      type: String,
      required: true,
    },

    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    services: {
      type: String,
      enum: ["mechanic", "service-provider", "both"],
      default: "service-provider",
    },

    mechanics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // optional, can be added later
      },
    ],

    photoUri: {
      type: String,
    },

    availableServices:
    [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Mechanical',
      }
    ],

    rating: {
      type: Number,
      default: 0,
    },

    password: {
      type: String, // only if needed for login (not recommended here)
      required:true
    },
  },
  {
    timestamps: true,
  }
);

mongooseAggregatePaginate(serviceCenterSchema);
// Index for geospatial queries
serviceCenterSchema.index({ location: "2dsphere" });

const ServiceCenter = mongoose.model("ServiceCenter", serviceCenterSchema);

export default ServiceCenter;

const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    currencyToExchange: {
      type: String,
      enum: ["curr1", "curr2"], // need full list of possible currencies here
      required: [true, "Set currency to be exchanged"],
    },
    currencyToReceive: {
      type: String,
      enum: ["curr1", "curr2"], // need full list of possible currencies here
      required: [true, "Set currency to receive"],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;

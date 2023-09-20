const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    amountToExchange: {
      type: Number,
      required: true,
    },
    currencyToExchange: {
      type: String,
      // enum: ["curr1", "curr2"], // need full list of possible currencies here
      required: [true, "Set currency to be exchanged"],
    },
    amountToReceive: {
      type: Number,
      required: true,
    },
    currencyToReceive: {
      type: String,
      // enum: ["curr1", "curr2"], // need full list of possible currencies here
      required: [true, "Set currency to receive"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["creditCard", "wallet"],
    },
    creditCard: {
      type: String,
    },
    wallet: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
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

transactionSchema.path("creditCard").validate(function (value) {
  if (!value && !this.wallet) {
    return false;
  }
  return true;
}, "Either creditCard or wallet is required.");

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;

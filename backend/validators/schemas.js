const Joi = require("joi")

const authSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(50),
    phone: Joi.string()
      .optional()
      .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().optional().min(2).max(50),
    phone: Joi.string()
      .optional()
      .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
    avatar: Joi.string().optional().uri(),
  }),
}

const transactionSchemas = {
  create: Joi.object({
    type: Joi.string().required().valid("income", "expense", "transfer"),
    category: Joi.string().required(),
    amount: Joi.number().required().positive(),
    description: Joi.string().optional().max(500),
    recipientId: Joi.string().optional(),
    paymentMethod: Joi.string().optional().valid("card", "bank_transfer", "cash", "digital_wallet"),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  update: Joi.object({
    category: Joi.string().optional(),
    amount: Joi.number().optional().positive(),
    description: Joi.string().optional().max(500),
    status: Joi.string().optional().valid("pending", "completed", "failed"),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
}

const recipientSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().optional().email(),
    phone: Joi.string()
      .optional()
      .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
    accountNumber: Joi.string().optional(),
    bankName: Joi.string().optional(),
    purpose: Joi.string().optional().valid("personal", "business", "family", "friend", "other"),
  }),

  update: Joi.object({
    name: Joi.string().optional().min(2).max(100),
    email: Joi.string().optional().email(),
    phone: Joi.string()
      .optional()
      .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
    accountNumber: Joi.string().optional(),
    bankName: Joi.string().optional(),
    purpose: Joi.string().optional().valid("personal", "business", "family", "friend", "other"),
  }),
}

const subscriptionSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(100),
    provider: Joi.string().optional().max(100),
    amount: Joi.number().required().positive(),
    frequency: Joi.string().required().valid("daily", "weekly", "monthly", "quarterly", "yearly"),
    nextBillingDate: Joi.date().required(),
    category: Joi.string().optional(),
    icon: Joi.string().optional(),
    notes: Joi.string().optional().max(500),
  }),

  update: Joi.object({
    name: Joi.string().optional().min(2).max(100),
    provider: Joi.string().optional().max(100),
    amount: Joi.number().optional().positive(),
    frequency: Joi.string().optional().valid("daily", "weekly", "monthly", "quarterly", "yearly"),
    nextBillingDate: Joi.date().optional(),
    status: Joi.string().optional().valid("active", "paused", "cancelled"),
    category: Joi.string().optional(),
    notes: Joi.string().optional().max(500),
  }),
}

const alertSchemas = {
  create: Joi.object({
    type: Joi.string()
      .required()
      .valid("income", "large_expense", "subscription", "anomaly", "savings_tip", "low_balance"),
    title: Joi.string().required().max(200),
    description: Joi.string().optional().max(500),
    amount: Joi.number().optional(),
    icon: Joi.string().optional(),
  }),
}

module.exports = {
  authSchemas,
  transactionSchemas,
  recipientSchemas,
  subscriptionSchemas,
  alertSchemas,
}

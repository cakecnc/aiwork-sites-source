import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const purchaseInquiries = sqliteTable(
  "purchase_inquiries",
  {
    id: text("id").primaryKey(),
    product: text("product").notNull(),
    locale: text("locale").notNull(),
    emailHash: text("email_hash").notNull(),
    ipHash: text("ip_hash").notNull(),
    payloadHash: text("payload_hash").notNull(),
    consentVersion: text("consent_version").notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
    operatorStatus: text("operator_status").notNull(),
    customerStatus: text("customer_status").notNull(),
    operatorProviderId: text("operator_provider_id"),
    customerProviderId: text("customer_provider_id"),
  },
  (table) => [
    index("purchase_inquiries_email_created_idx").on(
      table.emailHash,
      table.createdAt,
    ),
    index("purchase_inquiries_ip_created_idx").on(
      table.ipHash,
      table.createdAt,
    ),
    index("purchase_inquiries_created_idx").on(table.createdAt),
    index("purchase_inquiries_expires_idx").on(table.expiresAt),
  ],
);

export const inquiryRateLimits = sqliteTable(
  "inquiry_rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => [
    index("inquiry_rate_limits_expires_idx").on(table.expiresAt),
  ],
);

export const inquiryQuotaReservations = sqliteTable(
  "inquiry_quota_reservations",
  {
    id: text("id").primaryKey(),
    bucket: integer("bucket").notNull(),
    emailHash: text("email_hash").notNull(),
    ipHash: text("ip_hash").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => [
    index("inquiry_quota_email_bucket_idx").on(
      table.emailHash,
      table.bucket,
    ),
    index("inquiry_quota_ip_bucket_idx").on(table.ipHash, table.bucket),
    index("inquiry_quota_bucket_idx").on(table.bucket),
    index("inquiry_quota_expires_idx").on(table.expiresAt),
  ],
);

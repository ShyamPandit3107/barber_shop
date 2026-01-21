import { integer, pgTable ,pgEnum, uuid, text, timestamp, boolean,time,date,uniqueIndex} from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum("user_role", [
  "CUSTOMER",
  "BARBER",
  "OWNER",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "INITIATED",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const shops = pgTable("shops", {
  id: uuid("id").defaultRandom().primaryKey(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),

  name: text("name").notNull(),
  address: text("address"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});


export const barberProfiles = pgTable("barber_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),

  experienceYears: integer("experience_years"),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),

  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),

  name: text("name").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const barberSchedules = pgTable("barber_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),

  barberId: uuid("barber_id")
    .notNull()
    .references(() => barberProfiles.id),

  dayOfWeek: integer("day_of_week").notNull(), // 0–6
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
});

export const holidays = pgTable("holidays", {
  id: uuid("id").defaultRandom().primaryKey(),

  shopId: uuid("shop_id").references(() => shops.id),
  barberId: uuid("barber_id").references(() => barberProfiles.id),

  date: date("date").notNull(),
  reason: text("reason"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
});

export const slots = pgTable(
  "slots",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    barberId: uuid("barber_id")
      .notNull()
      .references(() => barberProfiles.id),

    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    isReserved: boolean("is_reserved").default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow(),
  },
  (t) => ({
    uniqBarberSlot: uniqueIndex("uniq_barber_slot_time").on(
      t.barberId,
      t.startTime,
      t.endTime
    ),
  })
);

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id),

  barberId: uuid("barber_id")
    .notNull()
    .references(() => barberProfiles.id),

  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),

  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),

  slotId: uuid("slot_id")
    .notNull()
    .unique()
    .references(() => slots.id),

  status: bookingStatusEnum("status")
    .default("PENDING")
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  bookingId: uuid("booking_id")
    .notNull()
    .unique()
    .references(() => bookings.id),

  amountCents: integer("amount_cents").notNull(),
  status: paymentStatusEnum("status").notNull(),

  provider: text("provider"),
  providerReference: text("provider_reference"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),
});
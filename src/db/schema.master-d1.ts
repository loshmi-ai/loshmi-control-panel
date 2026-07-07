import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const bitTensorTransactions = sqliteTable("bit_tensor_transactions", {
  id: text("id").notNull().unique().primaryKey(), // TX ID
  netuid: integer("netuid").notNull(),
  price: real("price").notNull(),
  event_id: text("event_id").notNull(),
  coldkey: text("coldkey").notNull(),
  hotkey: text("hotkey").notNull(),
  amount_in: real("amount_in").notNull(),
  amount_out: real("amount_out").notNull(),
  extrinsics: text("extrinsics").notNull(),
  tao_price_in_usd: real("tao_price_in_usd").notNull(), // TAO price in USD at the time of the transaction
  timestamp: text("timestamp").notNull(), // ISO string
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type BitTensorTransaction = InferSelectModel<
  typeof bitTensorTransactions
>;

export const savedWallets = sqliteTable("saved_wallets", {
  id: text("id").notNull().unique().primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  network: text("network", {
    enum: ["bittensor-mainnet", "bittensor-testnet"],
  }).notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type SavedWallet = InferSelectModel<typeof savedWallets>;

export const trackedSubnets = sqliteTable("tracked_subnets", {
  id: integer("id").notNull().unique().primaryKey(),
  network_registered_at: integer("network_registered_at"),
  owner_coldkey: text("owner_coldkey"),
  owner_hotkey: text("owner_hotkey"),
  tempo: integer("tempo"),
  price: real("price"),
  tao_in: real("tao_in"),
  alpha_in: real("alpha_in"),
  alpha_out: real("alpha_out"),
  subnet_name: text("subnet_name"),
  github_repo: text("github_repo"),
  subnet_contact: text("subnet_contact"),
  subnet_url: text("subnet_url"),
  subnet_website: text("subnet_website"),
  discord: text("discord"),
  additional: text("additional"),
  symbol: text("symbol"),
  root_prop: real("root_prop"),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type TrackedSubnet = InferSelectModel<typeof trackedSubnets>;

export const macroIndicators = sqliteTable("macro_indicators", {
  id: integer("id").notNull().unique().primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull(), // value is string because it can be anything
  value_type: text("value_type").notNull(),
  value_date: text("value_date").notNull(), // date on which the value was generated
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type MacroIndicator = InferSelectModel<typeof macroIndicators>;

export const bitTensorUserPortfolioAllocations = sqliteTable(
  "bit_tensor_user_portfolio_allocations",
  {
    id: text("id").notNull().unique().primaryKey(), // composite key: coldkey + hotkey
    coldkey: text("coldkey").notNull(),
    hotkey: text("hotkey").notNull(),
    validator_name: text("validator_name"),
    netuid: integer("netuid").notNull(),
    stake: real("stake").notNull(),
    tao_staked: real("tao_staked").notNull(),
    pnl_24h_tao: real("pnl_24h_tao").notNull(),
    price_change_pct_24h: real("price_change_pct_24h").notNull(),
    realized_pnl_tao: real("realized_pnl_tao").notNull(),
    unrealized_pnl_tao: real("unrealized_pnl_tao").notNull(),
    unrealized_pnl_pct: real("unrealized_pnl_pct").notNull(),
    reward_earnings_tao: real("reward_earnings_tao").notNull(),
    rewards_apy: real("rewards_apy"),
    total_pnl_tao: real("total_pnl_tao").notNull(),
    current_avg_buy_price: real("current_avg_buy_price").notNull(),
    avg_buy_price_at_last_sale: real("avg_buy_price_at_last_sale"),
    avg_sell_price: real("avg_sell_price"),
    total_alpha_bought: real("total_alpha_bought").notNull(),
    total_alpha_sold: real("total_alpha_sold").notNull(),
    total_tao_spent: real("total_tao_spent").notNull(),
    total_tao_received: real("total_tao_received").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
);

export type BitTensorUserPortfolioAllocation = InferSelectModel<
  typeof bitTensorUserPortfolioAllocations
>;

export const telegramMessageThreadMappings = sqliteTable(
  "telegram_message_thread_mappings",
  {
    id: text("id").notNull().unique().primaryKey(),
    thread_id: text("thread_id").notNull(),
    tg_message_id: integer("tg_message_id").notNull(),
    tg_chat_id: integer("tg_chat_id").notNull(),
    tg_message_thread_id: integer("tg_message_thread_id"),
    started_by_tg_user_id: integer("started_by_tg_user_id").notNull(), // ID of the user who started the thread
    from_tg_user_id: integer("from_tg_user_id").notNull(), // ID of the user who sent this message on the thread
    parent_thread_id: text("parent_thread_id"), // ID of the parent thread, if any
    response_message_tg_id: integer("response_message_tg_id")
      .notNull()
      .unique(), // ID of the message that is the response to this message
    response_message_chunk_idx: integer("response_message_chunk_idx")
      .notNull()
      .default(0), // Index of the chunk in the response message, becasue sometimes message are too long to be sent in one go
    tg_created_at: integer("tg_created_at").notNull(), // Timestamp of the message in Telegram
    created_at: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
);

export type TelegramMessageThreadMapping = InferSelectModel<
  typeof telegramMessageThreadMappings
>;

export const bitTensorExtrinsics = sqliteTable("bit_tensor_extrinsics", {
  id: text("id").notNull().unique().primaryKey(),
  raw_data: text("raw_data").notNull(),
  method: text("method").notNull(),
  section: text("section").notNull(),
  signer: text("signer").notNull(),
  netuid: integer("netuid"), // IDK if this will always be present
  nonce: integer("nonce").notNull(),
  timestamp: integer("timestamp").notNull().default(0),
  iso_timestamp: text("iso_timestamp"),
  base_fee: integer("base_fee").notNull().default(0),
  len_fee: integer("len_fee").notNull().default(0),
  adjusted_weight_fee: integer("adjusted_weight_fee").notNull().default(0),
  tip: integer("tip").notNull().default(0),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type BitTensorExtrinsic = InferSelectModel<typeof bitTensorExtrinsics>;

// Transfer is Tao In / Tao out. Transaction is interactin with subnets (staking/unstaking).
export const bitTensorTransfers = sqliteTable("bit_tensor_transfers", {
  id: text("id").primaryKey(), // e.g. finney-5085759-0081
  network: text("network"), // 'finney'
  block_number: integer("block_number"), // 5085759
  timestamp: text("timestamp"), // ISO string
  amount: text("amount"), // stored as string to preserve big int
  fee: text("fee"), // same here
  transaction_hash: text("transaction_hash"),
  extrinsic_id: text("extrinsic_id"),
  from_ss58: text("from_ss58"),
  from_hex: text("from_hex"),
  to_ss58: text("to_ss58"),
  to_hex: text("to_hex"),
  tao_price_in_usd: real("tao_price_in_usd"),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type BitTensorTransfer = InferSelectModel<typeof bitTensorTransfers>;

export const subnetHistoricalPrices = sqliteTable(
  "subnet_historical_prices",
  {
    id: integer("id").notNull().unique().primaryKey({ autoIncrement: true }),
    netuid: integer("netuid").notNull(),
    timestamp: text("timestamp").notNull(), // ISO string
    price_in_tao: real("price_in_tao").notNull(),
  },
  (t) => [
    index("idx_subnet_prices_netuid_timestamp").on(t.netuid, t.timestamp),
  ],
);

export type SubnetHistoricalPrice = InferSelectModel<
  typeof subnetHistoricalPrices
>;

export const googleDriveFiles: any = sqliteTable("google_drive_files", {
  id: text("id").primaryKey(), // we use google drive file id as primary key
  name: text("name").notNull(),
  parent_id: text("parent_id"),
  mime_type: text("mime_type").notNull(),
  modified_at: text("modified_at").notNull(), // ISO string to match other tables
  is_folder: integer("is_folder", { mode: "boolean" }).notNull(),
  file_created_time: text("file_created_time"), // ISO string
  file_modified_time: text("file_modified_time"), // ISO string
  size: integer("size"), // size is null for folders
  trashed: integer("trashed", { mode: "boolean" }).notNull(),
  ready_for_embedding: integer("ready_for_embedding", { mode: "boolean" })
    .notNull()
    .default(false),
  embedding_in_progress: integer("embedding_in_progress", { mode: "boolean" })
    .notNull()
    .default(false),
  embedding_error: text("embedding_error"),
  embedding_success: integer("embedding_success", { mode: "boolean" })
    .notNull()
    .default(false),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type GoogleDriveFile = InferSelectModel<typeof googleDriveFiles>;

export const scribeEnabledChats = sqliteTable("scribe_enabled_chats", {
  chat_id: integer("chat_id").notNull().primaryKey(),
  chat_name: text("chat_name"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  enabled_by_user_id: integer("enabled_by_user_id").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type ScribeEnabledChat = InferSelectModel<typeof scribeEnabledChats>;

export const scribeMessages = sqliteTable("scribe_messages", {
  // Primary key - Telegram message_id is unique per chat, so combine them
  id: text("id").notNull().primaryKey(), // format: `${chat_id}_${message_id}`

  // Telegram metadata
  chat_id: integer("chat_id").notNull(),
  message_id: integer("message_id").notNull(),
  from_user_id: integer("from_user_id"), // nullable for channel posts
  from_username: text("from_username"),
  from_first_name: text("from_first_name"),

  // Reply context
  reply_to_message_id: integer("reply_to_message_id"),

  // Forward context
  forward_from_user_id: integer("forward_from_user_id"),
  forward_from_chat_id: integer("forward_from_chat_id"),
  forward_date: integer("forward_date"), // unix timestamp

  // Message content - raw
  raw_text: text("raw_text"), // original message text
  raw_json: text("raw_json"), // full telegram message object for reference

  // Message content - enriched
  enriched_text: text("enriched_text"), // LLM-friendly version with expanded links, tweet content, etc.
  enriching_status: text("enriching_status").notNull().default("pending"), // pending, processing, completed, failed

  // Timestamps
  message_date: integer("message_date").notNull(), // telegram's date (unix timestamp)
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type ScribeMessageSelect = InferSelectModel<typeof scribeMessages>;

export type ScribeMessageInsert = InferInsertModel<typeof scribeMessages>;

CREATE TABLE `bit_tensor_extrinsics` (
	`id` text PRIMARY KEY NOT NULL,
	`raw_data` text NOT NULL,
	`method` text NOT NULL,
	`section` text NOT NULL,
	`signer` text NOT NULL,
	`netuid` integer,
	`nonce` integer NOT NULL,
	`timestamp` integer DEFAULT 0 NOT NULL,
	`iso_timestamp` text,
	`base_fee` integer DEFAULT 0 NOT NULL,
	`len_fee` integer DEFAULT 0 NOT NULL,
	`adjusted_weight_fee` integer DEFAULT 0 NOT NULL,
	`tip` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bit_tensor_extrinsics_id_unique` ON `bit_tensor_extrinsics` (`id`);--> statement-breakpoint
CREATE TABLE `bit_tensor_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`netuid` integer NOT NULL,
	`price` real NOT NULL,
	`event_id` text NOT NULL,
	`coldkey` text NOT NULL,
	`hotkey` text NOT NULL,
	`amount_in` real NOT NULL,
	`amount_out` real NOT NULL,
	`extrinsics` text NOT NULL,
	`tao_price_in_usd` real NOT NULL,
	`timestamp` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bit_tensor_transactions_id_unique` ON `bit_tensor_transactions` (`id`);--> statement-breakpoint
CREATE TABLE `bit_tensor_transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`network` text,
	`block_number` integer,
	`timestamp` text,
	`amount` text,
	`fee` text,
	`transaction_hash` text,
	`extrinsic_id` text,
	`from_ss58` text,
	`from_hex` text,
	`to_ss58` text,
	`to_hex` text,
	`tao_price_in_usd` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bit_tensor_user_portfolio_allocations` (
	`id` text PRIMARY KEY NOT NULL,
	`coldkey` text NOT NULL,
	`hotkey` text NOT NULL,
	`validator_name` text,
	`netuid` integer NOT NULL,
	`stake` real NOT NULL,
	`tao_staked` real NOT NULL,
	`pnl_24h_tao` real NOT NULL,
	`price_change_pct_24h` real NOT NULL,
	`realized_pnl_tao` real NOT NULL,
	`unrealized_pnl_tao` real NOT NULL,
	`unrealized_pnl_pct` real NOT NULL,
	`reward_earnings_tao` real NOT NULL,
	`rewards_apy` real,
	`total_pnl_tao` real NOT NULL,
	`current_avg_buy_price` real NOT NULL,
	`avg_buy_price_at_last_sale` real,
	`avg_sell_price` real,
	`total_alpha_bought` real NOT NULL,
	`total_alpha_sold` real NOT NULL,
	`total_tao_spent` real NOT NULL,
	`total_tao_received` real NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bit_tensor_user_portfolio_allocations_id_unique` ON `bit_tensor_user_portfolio_allocations` (`id`);--> statement-breakpoint
CREATE TABLE `google_drive_files` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parent_id` text,
	`mime_type` text NOT NULL,
	`modified_at` text NOT NULL,
	`is_folder` integer NOT NULL,
	`file_created_time` text,
	`file_modified_time` text,
	`size` integer,
	`trashed` integer NOT NULL,
	`ready_for_embedding` integer DEFAULT false NOT NULL,
	`embedding_in_progress` integer DEFAULT false NOT NULL,
	`embedding_error` text,
	`embedding_success` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `macro_indicators` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`value_type` text NOT NULL,
	`value_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `macro_indicators_id_unique` ON `macro_indicators` (`id`);--> statement-breakpoint
CREATE TABLE `saved_wallets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`network` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `saved_wallets_id_unique` ON `saved_wallets` (`id`);--> statement-breakpoint
CREATE TABLE `scribe_enabled_chats` (
	`chat_id` integer PRIMARY KEY NOT NULL,
	`chat_name` text,
	`enabled` integer DEFAULT true NOT NULL,
	`enabled_by_user_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scribe_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` integer NOT NULL,
	`message_id` integer NOT NULL,
	`from_user_id` integer,
	`from_username` text,
	`from_first_name` text,
	`reply_to_message_id` integer,
	`forward_from_user_id` integer,
	`forward_from_chat_id` integer,
	`forward_date` integer,
	`raw_text` text,
	`raw_json` text,
	`enriched_text` text,
	`enriching_status` text DEFAULT 'pending' NOT NULL,
	`message_date` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subnet_historical_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`netuid` integer NOT NULL,
	`timestamp` text NOT NULL,
	`price_in_tao` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subnet_historical_prices_id_unique` ON `subnet_historical_prices` (`id`);--> statement-breakpoint
CREATE INDEX `idx_subnet_prices_netuid_timestamp` ON `subnet_historical_prices` (`netuid`,`timestamp`);--> statement-breakpoint
CREATE TABLE `telegram_message_thread_mappings` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`tg_message_id` integer NOT NULL,
	`tg_chat_id` integer NOT NULL,
	`tg_message_thread_id` integer,
	`started_by_tg_user_id` integer NOT NULL,
	`from_tg_user_id` integer NOT NULL,
	`parent_thread_id` text,
	`response_message_tg_id` integer NOT NULL,
	`response_message_chunk_idx` integer DEFAULT 0 NOT NULL,
	`tg_created_at` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `telegram_message_thread_mappings_id_unique` ON `telegram_message_thread_mappings` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `telegram_message_thread_mappings_response_message_tg_id_unique` ON `telegram_message_thread_mappings` (`response_message_tg_id`);--> statement-breakpoint
CREATE TABLE `tracked_subnets` (
	`id` integer PRIMARY KEY NOT NULL,
	`network_registered_at` integer,
	`owner_coldkey` text,
	`owner_hotkey` text,
	`tempo` integer,
	`price` real,
	`tao_in` real,
	`alpha_in` real,
	`alpha_out` real,
	`subnet_name` text,
	`github_repo` text,
	`subnet_contact` text,
	`subnet_url` text,
	`subnet_website` text,
	`discord` text,
	`additional` text,
	`symbol` text,
	`root_prop` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tracked_subnets_id_unique` ON `tracked_subnets` (`id`);
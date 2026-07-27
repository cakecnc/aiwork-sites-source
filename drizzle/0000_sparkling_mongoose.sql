CREATE TABLE `inquiry_quota_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`bucket` integer NOT NULL,
	`email_hash` text NOT NULL,
	`ip_hash` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiry_quota_email_bucket_idx` ON `inquiry_quota_reservations` (`email_hash`,`bucket`);--> statement-breakpoint
CREATE INDEX `inquiry_quota_ip_bucket_idx` ON `inquiry_quota_reservations` (`ip_hash`,`bucket`);--> statement-breakpoint
CREATE INDEX `inquiry_quota_bucket_idx` ON `inquiry_quota_reservations` (`bucket`);--> statement-breakpoint
CREATE INDEX `inquiry_quota_expires_idx` ON `inquiry_quota_reservations` (`expires_at`);--> statement-breakpoint
CREATE TABLE `inquiry_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiry_rate_limits_expires_idx` ON `inquiry_rate_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `purchase_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`product` text NOT NULL,
	`locale` text NOT NULL,
	`email_hash` text NOT NULL,
	`ip_hash` text NOT NULL,
	`payload_hash` text NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`operator_status` text NOT NULL,
	`customer_status` text NOT NULL,
	`operator_provider_id` text,
	`customer_provider_id` text
);
--> statement-breakpoint
CREATE INDEX `purchase_inquiries_email_created_idx` ON `purchase_inquiries` (`email_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `purchase_inquiries_ip_created_idx` ON `purchase_inquiries` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `purchase_inquiries_created_idx` ON `purchase_inquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `purchase_inquiries_expires_idx` ON `purchase_inquiries` (`expires_at`);